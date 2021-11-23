using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using System.Text.Json.Serialization;

namespace FMS.Entity.Context.Models
{
    public class Account
    {
        [Key]
        [Required]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int AccountId { get; set; }
        [Required]
        public int AccountNumber { get; set; }
        [Required]
        public AccountType AccountType { get; set; }
        
        [Required]
        [ForeignKey(nameof(Bank))]
        public int BankId { get; set; }

        [JsonIgnore]
        public Bank Bank { get; set; }

        [Required]
        public decimal Balance { get; set; }
        public ICollection<BankTransaction> BankTransactions { get; set; }
    }
}
