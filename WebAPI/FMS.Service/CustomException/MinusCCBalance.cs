using System;
using System.Collections.Generic;
using System.Text;

namespace FMS.Service.CustomException
{
    public class MinusCCBalance : Exception
    {
        public MinusCCBalance(string message) : base(message)
        {

        }
    }
}
