pipeline {
    agent any
    environment {
		service="workflow-ui"
		def workspace = pwd()
		namespace="workflow"
		Branch="${env.gitlabTargetBranch}"
	}
	stages {
		stage('Clean'){
			steps {
				echo "0.Delete workspace before build starts"
				step([$class: 'WsCleanup'])
			}
		}

		stage('Clone') {
			steps {
				echo "1.Clone Stage"
				dir('workflow-designer-ui'){
					git branch: 'develop', credentialsId: 'lulongchao', url: 'http://192.100.30.115:9000/job_workflow_platform/workflow-designer-ui.git'
					script {
						build_tag = sh(returnStdout: true, script: 'git rev-parse --short HEAD').trim()
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
		stage('Check') {
			steps {
				echo "5.校验程序是否部署成功"
				sh """
				sudo kubectl get pod -n ${namespace}
				"""
			}
		}
	}
	post {
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
			        		"- 发布状态：<font color=\"#FF0000\">失败</font>"
                        ],
                        at: []
                    )
				}
			}
        }
    }
}
