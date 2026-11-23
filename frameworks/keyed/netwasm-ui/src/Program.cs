using System.Runtime.InteropServices.JavaScript;
using NetWasm.UI.Browser;

namespace NetWasmUiBench;

public static partial class Program
{
    [JSExport("start")]
    public static void Start() => BrowserApp.Start(new App(), "#main");
}
