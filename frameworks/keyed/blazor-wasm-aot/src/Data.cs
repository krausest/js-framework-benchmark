using Microsoft.AspNetCore.Components.Web;

namespace blazor_wasm
{
    public class Data
    {
        public int Id { get; set; } = default!;
        public string Label { get; set; } = default!;

        public Action<MouseEventArgs> Remove { get; set; } = default!;
        public Action<MouseEventArgs> Select { get; set; } = default!;
    }
}