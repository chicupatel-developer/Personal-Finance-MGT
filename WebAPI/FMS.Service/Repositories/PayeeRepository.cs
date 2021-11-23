using FMS.Entity.Context;
using FMS.Entity.Context.Models;
using FMS.Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using FMS.Service.DTOs;

namespace FMS.Service.Repositories
{
    public class PayeeRepository : IPayeeRepository
    {
        private readonly FMSContext appDbContext;

        public PayeeRepository(FMSContext appDbContext)
        {
            this.appDbContext = appDbContext;
        }

        public IEnumerable<Payee> GetAllPayees()
        {
            List<Payee> payees = new List<Payee>();
            var payeesDb = appDbContext.Payees;
            if (payeesDb != null)
            {
                payees = payeesDb.ToList();
            }
            return payees;
        }

        public Payee AddPayee(Payee payee)
        {
            var result = appDbContext.Payees.Add(payee);
            appDbContext.SaveChanges();
            return result.Entity;
        }

        public List<string> GetAllPayeeTypes()
        {
            List<string> payeeTypes = new List<string>();
            foreach (string payeeType in Enum.GetNames(typeof(PayeeType)))
            {
                payeeTypes.Add(payeeType);
            }
            return payeeTypes;
        }

        public IEnumerable<Payee> GetAllPayeesCC()
        {
            List<Payee> payees = new List<Payee>();
            var payeesDb = appDbContext.Payees
                            .Where(x=>x.PayeeType==PayeeType.CreditCard);
            if (payeesDb != null)
            {
                payees = payeesDb.ToList();
            }
            return payees;
        }
    }
}
