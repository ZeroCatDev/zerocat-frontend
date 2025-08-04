import smtplib
import dns.resolver

# 去 DNS lookup Gmail 接收 MX
mx = str(sorted(dns.resolver.resolve('gmail.com', 'MX'), key=lambda r: r.preference)[0].exchange)
s = smtplib.SMTP(mx, 587)  # Gmail SMTP 端口
s.ehlo()  # SMTP 握手
s.set_debuglevel(1)
s.sendmail(
    'spoof@outlook.com',        # “伪造发件人”
    'sun05985@gmail.com', # 测试用收件 Gmail
    'Subject: test！\r\n'
    'From: Spoofed Outlook <spoof@outlook.com>\r\n'
    '\r\n'
    'test\r\n'
)
s.quit()