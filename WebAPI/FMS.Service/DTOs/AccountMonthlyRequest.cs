using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace FMS.Service.DTOs
{
    public class AccountMonthlyRequest
    {
        [Required]
        public int BankId { get; set; }
        [Required]
        public int AccountId { get; set;  }
    }
}
