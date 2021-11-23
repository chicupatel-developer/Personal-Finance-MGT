using FMS.Entity.Context.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace FMS.Service.DTOs
{
    public class BankAccountVM
    {     
        public int BankId { get; set; }
        public string BankName { get; set; }
        public List<AccountVM> Accounts { get; set; }
    }
}
