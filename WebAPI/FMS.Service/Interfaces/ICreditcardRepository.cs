using FMS.Entity.Context.Models;
using FMS.Service.DTOs;
using System;
using System.Collections.Generic;
using System.Text;

namespace FMS.Service.Interfaces
{
    public interface ICreditcardRepository
    {
        IEnumerable<CreditCard> GetAllCCs();
        CreditCardStatement GetCreditCardStatementAll(CreditCard cc);
        CreditCardTransaction AddCCTransaction(CreditCardTransaction ccTransaction);
    }
}
