using FMS.Entity.Context.Models;
using FMS.Service.DTOs;
using FMS.Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace FMS.Test.PayeeTest
{
    public class PayeeRepositoryFake : IPayeeRepository
    {
        private readonly List<Payee> _payees;
        public PayeeRepositoryFake()
        {
            _payees = new List<Payee>()
            {
                new Payee() { 
                     Balance=0,
                      Description = "Payee - 1",
                       PayeeACNumber = "1234",
                        PayeeId = 1,
                         PayeeName = "Payee - 1",
                          PayeeType = PayeeType.Hydro
                },
                  new Payee() {
                     Balance=0,
                      Description = "Payee - 2",
                       PayeeACNumber = "2345",
                        PayeeId = 2,
                         PayeeName = "Payee - 2",
                          PayeeType = PayeeType.SuperStore
                },
                    new Payee() {
                     Balance=1000,
                      Description = "VISA",
                       PayeeACNumber = "3456",
                        PayeeId = 3,
                         PayeeName = "VISA",
                          PayeeType = PayeeType.CreditCard
                },

            };
        }
        public IEnumerable<Payee> GetAllPayees()
        {
            return _payees;
        }
        public Payee AddPayee(Payee payee)
        {
            _payees.Add(payee);
            return payee;
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
            var payeesDb = _payees
                            .Where(x => x.PayeeType == PayeeType.CreditCard);
            if (payeesDb != null)
            {
                payees = payeesDb.ToList();
            }
            return payees;
        }


        public Payee GetPayee(int payeeId)
        {
            return _payees.Where(a => a.PayeeId == payeeId)
                .FirstOrDefault();
        }
        public Payee EditPayee(Payee payee)
        {
            var result = _payees.Where(x => x.PayeeId == payee.PayeeId).FirstOrDefault();
            if (result != null)
            {
                result.PayeeName = payee.PayeeName;
                result.Description = payee.Description;
                result.PayeeACNumber = payee.PayeeACNumber;
                result.Balance = payee.Balance;
                result.PayeeType = payee.PayeeType;

                return payee;
            }
            else
            {
                return null;
            }
        }

    }
}
