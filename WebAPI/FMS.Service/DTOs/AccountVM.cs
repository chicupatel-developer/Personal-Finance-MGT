using FMS.Entity.Context.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using System.Text.Json.Serialization;


namespace FMS.Service.DTOs
{
    public class AccountVM
    {
        [Required(ErrorMessage = "Account is required")]
        public int AccountId { get; set; }
        public int AccountNumber { get; set; }
        public AccountType AccountType { get; set; }
        public decimal Balance { get; set; }
    }
}
