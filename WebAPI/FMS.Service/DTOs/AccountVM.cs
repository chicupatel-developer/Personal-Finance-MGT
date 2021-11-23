using FMS.Entity.Context.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace FMS.Service.DTOs
{
    public class AccountVM
    {
        public int AccountId { get; set; }
        public int AccountNumber { get; set; }
        public AccountType AccountType { get; set; }
        public decimal Balance { get; set; }
    }
}
