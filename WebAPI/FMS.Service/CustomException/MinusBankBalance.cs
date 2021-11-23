using System;
using System.Collections.Generic;
using System.Text;

namespace FMS.Service.CustomException
{
    public class MinusBankBalance : Exception
    {
        public MinusBankBalance(string message) : base(message)
        {

        }
    }
}
