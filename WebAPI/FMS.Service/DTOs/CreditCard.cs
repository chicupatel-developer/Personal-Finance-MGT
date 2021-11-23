using FMS.Entity.Context.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace FMS.Service.DTOs
{
    public class CreditCard
    {
        public int CreditCardId { get; set; }
        public string CreditCardName { get; set; }
        public string CreditCardNumber { get; set; }
        public PayeeType PayeeType { get; set; }
        public decimal Balance { get; set; }
    }
}
