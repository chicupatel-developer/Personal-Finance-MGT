using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using System.Text.Json.Serialization;

namespace FMS.Entity.Context.Models
{
    public class CreditCardTransaction
    {
        [Key]
        [Required]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int CreditCardTransactionId { get; set; }

        // payeeId from payees of selected cc by which payment is done - source     
        [Required]
        public int CreditCardId { get; set; }
       
        [Required]
        public decimal TransactionAmount { get; set; }
        [Required]
        public DateTime TransactionDate { get; set; }        
        public TransactionStatus TransactionStatus { get; set; }

        // payeeeId from payees of selected payee to which payment is done - destination
        [Required]
        [ForeignKey(nameof(Payee))]
        public int PayeeId { get; set; }
        [JsonIgnore]
        public Payee Payee { get; set; }

        public decimal LastBalance { get; set; }
        public decimal CurrentBalance { get; set; }

        public string RefCode { get; set; }
        public TransactionType TransactionType { get; set; }
    }
}
