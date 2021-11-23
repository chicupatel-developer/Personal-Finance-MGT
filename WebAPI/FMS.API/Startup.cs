using FMS.Entity.Context;
using FMS.Service.Interfaces;
using FMS.Service.Repositories;
using LinesCount;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FMS.API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();

            #region Repositories
            services.AddTransient<IBankRepository, BankRepository>();
            services.AddTransient<IAccountRepository, AccountRepository>();
            services.AddTransient<IPayeeRepository, PayeeRepository>();
            services.AddTransient<IBankTransactionRepository, BankTransactionRepository>();
            services.AddTransient<ICreditcardRepository, CreditcardRepository>();
            services.AddTransient<ISourceRepository, SourceRepository>();
            services.AddTransient<ILineCount, LineCount>();
            services.AddTransient<IEntityMonitorRepository, EntityMonitorRepository>();
            #endregion

            #region FMSContext
            services.AddDbContext<FMSContext>(options =>
                    options.UseSqlServer(
                      Configuration.GetConnectionString("FMSConnection"),
                      b => b.MigrationsAssembly(typeof(FMSContext).Assembly.FullName)));
            #endregion

            #region cors
            services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy",
                    builder => builder.AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader());
            });
            #endregion
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseCors("CorsPolicy");

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
