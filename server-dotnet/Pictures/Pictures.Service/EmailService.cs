using Microsoft.Extensions.Configuration;
using Pictures.Core.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace Pictures.Service
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendEmailAsync(string to, string subject, string body)
        {
            var from = _config["Email:SmtpUser"];
            var smtpClient = new SmtpClient(_config["Email:SmtpHost"])
            {
                Port = int.Parse(_config["Email:SmtpPort"]),
                Credentials = new NetworkCredential(from, _config["Email:SmtpPassword"]),
                EnableSsl = true,
            };

            var mailMessage = new MailMessage(from, to, subject, body);
            await smtpClient.SendMailAsync(mailMessage);
        }
    }

}
