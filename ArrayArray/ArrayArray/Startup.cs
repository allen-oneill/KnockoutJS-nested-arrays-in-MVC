using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(ArrayArray.Startup))]
namespace ArrayArray
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
