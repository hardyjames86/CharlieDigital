using CharlieDigital.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Umbraco.Web.Mvc;
using SendGrid;
using System.Net;
using System.Configuration;
using System.Diagnostics;
using SendGrid.Helpers.Mail;
using System.Collections.Concurrent;
using System.Net.Mail;
using System.Text;
using System.Web;
using Microsoft.AspNet.Identity;

namespace CharlieDigital.Controllers
{
    public class HomeController : SurfaceController

    {
        // GET: Home
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public string SendEmail( Contact contact) {

            var myMessage = new SendGridMessage();
            var from = new EmailAddress("inquiry@charliedigital.co.uk", "Website Enquiry ");
            myMessage.AddTo("info@charliedigital.co.uk");
            myMessage.From = from;
            myMessage.Subject = "Message from " + contact.first_name + " " + contact.last_name + " " +contact.email + " "  + contact.phone;

            var fromAddress = new MailAddress("dgresponsive@gmail.com", "Website Enquiry");
            var toAddress = new MailAddress("info@charliedigital.co.uk", "WEbsite Enquiry");
             string fromPassword = "xavUkam3Va2e";
             string subject = "Message from " + contact.first_name + " " + contact.last_name + " " + contact.email + " " + contact.phone;
             string body = contact.message;

            var smtp = new SmtpClient
            {
                Host = "smtp.gmail.com",
                Port = 587,
                EnableSsl = true,
                DeliveryMethod = SmtpDeliveryMethod.Network,
                UseDefaultCredentials = true,
                Credentials = new NetworkCredential(fromAddress.Address, fromPassword)
            };
            using (var message = new MailMessage(fromAddress, toAddress)
            {
                Subject = subject,
                Body = body
            })
            {
                smtp.Send(message);
                return "Thankyou for getting in contact. We will get back to you soon!";
            }


    
        }


 

    }
}