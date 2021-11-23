using System;
using System.Collections.Generic;
using System.Text;

namespace FMS.Service.CustomException
{
    public class CreditCardNotFound : Exception
    {
        public CreditCardNotFound(string message) : base(message)
        {

        }
    }
}
