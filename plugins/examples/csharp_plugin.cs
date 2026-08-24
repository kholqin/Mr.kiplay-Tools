using System;

// Contoh aman: menghasilkan rencana statis dan tidak mengakses target.
public static class MrkPluginExample
{
    public static void Main()
    {
        Console.WriteLine("{\"plugin\":\"example.headers-review\",\"status\":\"planned\",\"manualValidationRequired\":true,\"actions\":[]}");
    }
}
