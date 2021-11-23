using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace FMS.Entity.Context.Models
{
    public class Payee
    {
        [Key]
        [Required]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int PayeeId { get; set; }
        [Required]
        public string PayeeName { get; set; }
        [Required]
        public string Description { get; set; }
        [Required]
        public string PayeeACNumber { get; set; }
        [Required]
        public PayeeType PayeeType { get; set; }


        // only for CreditCard type of PayeeType
        public decimal Balance { get; set; }

        public ICollection<CreditCardTransaction> CreditCardTransactions { get; set; }
     
    }
}
