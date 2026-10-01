import { RouterOSAPI } from 'routeros-client'

export class MikroTikManager {
  private client: any

  constructor(
    private host: string,
    private username: string,
    private password: string
  ) {}

  async connect() {
    try {
      this.client = new RouterOSAPI({
        host: this.host,
        user: this.username,
        password: this.password,
        port: 8728,
        timeout: 5000
      })
      await this.client.connect()
      console.log('✅ تم الاتصال بـ MikroTik')
      return true
    } catch (error) {
      console.error('❌ فشل الاتصال:', error)
      return false
    }
  }

  async disconnect() {
    if (this.client) {
      await this.client.close()
    }
  }

  // إنشاء مستخدم جديد
  async createUser(name: string, password: string, group: string = 'full') {
    try {
      await this.client.write('/user/add', {
        name,
        password,
        group
      })
      console.log(`✅ تم إنشاء المستخدم: ${name}`)
      return true
    } catch (error) {
      console.error('❌ فشل إنشاء المستخدم:', error)
      return false
    }
  }

  // حذف مستخدم
  async deleteUser(name: string) {
    try {
      const users = await this.client.write('/user/print', {
        '?name': name
      })
      
      if (users.length > 0) {
        await this.client.write('/user/remove', {
          '.id': users[0]['.id']
        })
        console.log(`✅ تم حذف المستخدم: ${name}`)
        return true
      }
      return false
    } catch (error) {
      console.error('❌ فشل حذف المستخدم:', error)
      return false
    }
  }

  // تفعيل API
  async enableAPI() {
    try {
      await this.client.write('/ip/service/enable', {
        numbers: 'api'
      })
      console.log('✅ تم تفعيل API')
      return true
    } catch (error) {
      console.error(' فشل تفعيل API:', error)
      return false
    }
  }

  // إنشاء اتصال L2TP
  async createL2TPConnection(
    name: string,
    connectTo: string,
    user: string,
    password: string
  ) {
    try {
      await this.client.write('/interface/l2tp-client/add', {
        name,
        'connect-to': connectTo,
        user,
        password,
        'use-ipsec': 'no',
        'add-default-route': 'no',
        'use-peer-dns': 'no',
        disabled: 'no'
      })
      console.log(`✅ تم إنشاء اتصال L2TP: ${name}`)
      return true
    } catch (error) {
      console.error('❌ فشل إنشاء L2TP:', error)
      return false
    }
  }

  // الحصول على معلومات الجهاز
  async getSystemInfo() {
    try {
      const info = await this.client.write('/system/resource/print')
      return info[0]
    } catch (error) {
      console.error('❌ فشل جلب المعلومات:', error)
      return null
    }
  }
}

// مثال للاستخدام
export async function connectToMikroTik() {
  const mikrotik = new MikroTikManager(
    '192.168.88.1',  // IP الجهاز
    'admin',          // اسم المستخدم
    'password'        // كلمة المرور
  )

  const connected = await mikrotik.connect()
  
  if (connected) {
    // تفعيل API
    await mikrotik.enableAPI()
    
    // إنشاء مستخدم
    await mikrotik.createUser('tc_user', 'secure_password')
    
    // إنشاء اتصال L2TP
    await mikrotik.createL2TPConnection(
      'l2tp_connection',
      '185.188.249.189',
      'username',
      'password'
    )
    
    // جلب معلومات الجهاز
    const info = await mikrotik.getSystemInfo()
    console.log('معلومات الجهاز:', info)
    
    await mikrotik.disconnect()
  }

  return connected
}
