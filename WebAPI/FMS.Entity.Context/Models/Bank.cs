﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using System.Text.Json.Serialization;

namespace FMS.Entity.Context.Models
{
    public class Bank
    {
        [Key]
        [Required]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int BankId { get; set; }
        [Required(ErrorMessage = "Bank Name is required")]
        public string BankName { get; set; }    

        public ICollection<Account> Accounts { get; set; }
        public ICollection<BankTransaction> BankTransactions { get; set; }
    }
}
