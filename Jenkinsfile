@Library('shared-library@demo') _
def postRequest = new org.devops.postToElasticsearch()
def quality = new org.devops.sonarQualityScanner()

pipeline {
    agent any
    environment {
		service="workflow-ui"
		def workspace = pwd()
		namespace="workflow"
		Branch="${env.gitlabTargetBranch}"
		starttime = getDateFormat()
		BUILD_USER = getBuildUser()
		project="workflow engine platform"
		gitURL="http://192.100.30.115:9000/job_workflow_platform/workflow-designer-ui.git"
		environment="dev"
		applicationType="webfront"
		isStandalone="yes"
	}
	stages {
		stage('Clean'){
			steps {
				echo "0.Delete workspace before build starts develop"
				step([$class: 'WsCleanup'])
			}
		}

		stage('Clone') {
			steps {
				echo "1.Clone Stage"
				dir('workflow-designer-ui'){
					git branch: "$Branch", credentialsId: 'lulongchao', url: "${gitURL}"
					script {
						build_tag = sh(returnStdout: true, script: 'git rev-parse --short HEAD').trim()
						commit_message = sh(returnStdout: true, script: 'git log --pretty=format:"[%cn] - %s - %b" -1 |  grep -v See | sed "/^\\$/d" ').trim()
					}
				}  
			}
		}
		stage('Package') {
			steps {
				echo "2. Npm build Package"
				sh """
				cd $workspace/workflow-designer-ui
				cnpm install
				cnpm run build
				"""
			}
		}
		
		stage('Build') {
			steps {
				echo "3.Build Docker Image Stage"
				dir("workflow-designer-ui") {
				sh """
				cat >Dockerfile<<-EOF
					FROM nginx:alpine
					ADD dist /usr/share/nginx/html/workflow
				EOF
				cat Dockerfile 
				cat >deployment.yaml<<-EOF
				apiVersion: apps/v1
				kind: Deployment
				metadata:
				  labels:
				    app: <SECNAME>
				  name: <SECNAME>
				  namespace: <NAMESPACE>
				spec:
				  replicas: 1
				  selector:
				    matchLabels:
				      app: <SECNAME>
				  template:
				    metadata:
				      labels:
				        app: <SECNAME>
				    spec:
				      containers:
				        - image: <IMAGE>:<IMAGETAG>
				          name: <SECNAME>
				EOF
				"""
				echo "service:build_tag  ${service}:${build_tag}"
				sh """
				sudo docker build -t 192.100.30.160:9000/${service}:${build_tag} .
				"""
				}
			}
		}
		stage('Push') {
			steps {
				echo "4.Push Docker Image Stage"
				withCredentials([usernamePassword(credentialsId: 'dockerHub', passwordVariable: 'dockerHubPassword', usernameVariable: 'dockerHubUser')]) {
					sh """ 
					sudo docker login -u ${dockerHubUser} -p ${dockerHubPassword} http://192.100.30.160:9000
					sudo docker push 192.100.30.160:9000/${service}:${build_tag}
					"""
				}
			}
		}

		stage('Deploy') {
			steps {
				echo "5. Deploy Stage"
				echo "This is a deploy step "
				dir("workflow-designer-ui") {
					sh """
					sed -i 's/<IMAGETAG>/${build_tag}/' deployment.yaml
					sed -i 's@<IMAGE>@192.100.30.160:9000/${service}@' deployment.yaml
					sed -i 's/<SECNAME>/${service}/' deployment.yaml
					sed -i 's/<NAMESPACE>/${namespace}/' deployment.yaml
					cat deployment.yaml
					"""
					echo "远程执行kubectl apply -f deployment.yaml"
					sh "sudo kubectl apply -f deployment.yaml"
				}
			}
		}
        stage('Check Deploy Status'){
            steps{
                script{
                    println "判断程序是否启动成功，等待180S"
                    sleep(180)
                    POD_RESULT = sh(returnStdout: true, script: '''sudo kubectl get pod -l app=${service} -n ${namespace} | awk 'NR!=1{print $3}' | grep Running | wc -l ''').trim()
                    println "pod status: ${POD_RESULT}"
                    if ( "${POD_RESULT}" == '0' ){
                        error "This pod status not running!"
                    }
                }
            }
        }
	}
	post {
       always {
           script {
               println "Push deploy message to ELK"
               projectId = "com.siact.product.jwp:workflow-design-ui"
				try {
					metricValue = quality.GetQualityStatus(projectId,'bugs,coverage,tests,vulnerabilities')
					coverageRate = quality.GetMetricValue(metricValue,"coverage")
					unitTestNumber = quality.GetMetricValue(metricValue,"tests")
					bugs = quality.GetMetricValue(metricValue,"bugs")
					vulnerabilities = quality.GetMetricValue(metricValue,"vulnerabilities")
				} catch (err){
					coverageRate = 0
					unitTestNumber = 0
					bugs = 0 
					vulnerabilities = 0
				} 
               endtime = getDateFormat()
               duration = getDurationTime starttime,endtime
               body = """
               {
                    "triggerBy": "${BUILD_USER}",
                    "project": "${project}",
                    "git": "${gitURL}",
                    "branch": "${Branch}",
                    "environment": "${environment}",
                    "status": "${currentBuild.currentResult}",
                    "buildNumer": "${BUILD_ID}",
                    "contact": "${BUILD_USER}",
                    "jenkinsJobName": "${JOB_NAME}",
                    "jenkinsJobURL": "${BUILD_URL}",
                    "jenkinsJobStartTime": "${starttime}",
                    "jenkinsJobEndTime": "${endtime}",
                    "duration": ${duration},
                    "applicationType": "${applicationType}",
                    "isStandalone": "${isStandalone}",
                    "quality":{
                        "unitest-coverage-rate": ${coverageRate},
                        "unitest-number": ${unitTestNumber},
                        "bugs": ${bugs},
                        "security-issue": ${vulnerabilities}
                    } ,
					"deployment":{
                        "hostName": "k8s.isact.com",
                        "IP": "192.100.30.188",
                        "platform": "K8S",
                        "deploymentAccount": "root",
                        "applicationType": "${applicationType}",
                        "onCloud": "no",
                        "operationSystem": "Docker"
                    }	
                }
				"""
				result = postRequest.sendPostRequest(body,"${environment}")
            }
        }
        success {
            script {
				if ( "${Branch}" == 'null' ) {
                    dingtalk (
                        robot: '3f9a7477-8b62-441b-9b49-5fa3cf6c1f89',
                        type: 'MARKDOWN',
                        title: 'Jenkins构建通知',
                        text: [
                            "# <font color=\"#80FF00\">CI/CD执行成功</font>",
			        		'---',
			        		"- 服务名称：${JOB_BASE_NAME}",
			        		"- 发版方式：手动 ",
			        		"- 任务ID：[${BUILD_ID}](${RUN_DISPLAY_URL})",
							"- 提交信息：${commit_message}",
			        		"- 发布状态：<font color=\"#80FF00\">成功</font> "
                        ],
                        at: []
                    )
				}
			    else {
			        dingtalk (
                            robot: '3f9a7477-8b62-441b-9b49-5fa3cf6c1f89',
                            type: 'MARKDOWN',
                            title: 'Jenkins构建通知',
                            text: [
                                 "# <font  color=\"#80FF00\">CI/CD执行成功</font>",
			            		'---',
			            		"- 服务名称：${JOB_BASE_NAME}",
			            		"- 发版方式：GitLab WebHook",
			            		"- 任务ID：[${BUILD_ID}](${RUN_DISPLAY_URL})",
								"- 提交信息：${commit_message}",
			            		"- 发布状态：<font  color=\"#80FF00\">成功</font> "
                            ],
                            at: []
                    )
			    }
            }
        }
        failure {
            script {
				if ( "${Branch}" == 'null' ) {
                    dingtalk (
                        robot: '3f9a7477-8b62-441b-9b49-5fa3cf6c1f89',
                        type: 'MARKDOWN',
                        title: 'Jenkins 发布通知',
                        text: [
                            "# <font  color=\"#FF0000\">CI/CD执行失败</font>",
			        		'---',
			        		"- 服务名称：${JOB_BASE_NAME}",
			        		"- 发版方式：手动",
			        		"- 任务ID：[${BUILD_ID}](${RUN_DISPLAY_URL})",
							"- 提交信息：${commit_message}",
			        		"- 发布状态：<font color=\"#FF0000\">失败</font>"
                        ],
                        at: []
                    )
				}
				else {
				    dingtalk (
                        robot: '3f9a7477-8b62-441b-9b49-5fa3cf6c1f89',
                        type: 'MARKDOWN',
                        title: 'Jenkins 发布通知',
                        text: [
                            "# <font color=\"#FF0000\">CI/CD执行失败</font>",
			        		'---',
			        		"- 服务名称：${JOB_BASE_NAME}",
			        		"- 发版方式：GitLab WebHook",
			        		"- 任务ID：[${BUILD_ID}](${RUN_DISPLAY_URL})",
							"- 提交信息：${commit_message}",
			        		"- 发布状态：<font color=\"#FF0000\">失败</font>"
                        ],
                        at: []
                    )
				}
			}
        }
    }
}
