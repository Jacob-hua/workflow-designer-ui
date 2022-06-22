import { getGlobalUUID } from '@/api/globalConfig'

export const generateUUID = async () => {
  try {
    const { errorInfo, result: uuid } = await getGlobalUUID()
    if (errorInfo.errorCode) {
      return
    }
    return uuid
  } catch (error) {
    return
  }
}
