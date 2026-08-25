import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.regex.Pattern;

/** Adapter contract example: stdin JSON-in, stdout JSON-out. Network access belongs to the host policy layer. */
public final class MrkiplayJavaPlugin {
  private static final Pattern PUBLIC_TARGET = Pattern.compile("^[a-zA-Z0-9.-]{1,253}$");
  public static void main(String[] args) throws Exception {
    String input = new BufferedReader(new InputStreamReader(System.in)).readLine();
    if (input == null || !PUBLIC_TARGET.matcher(input.trim()).matches()) {
      System.out.println("{\"ok\":false,\"error\":\"target tidak valid atau bukan hostname publik\"}");
      return;
    }
    System.out.println("{\"ok\":true,\"module\":\"java-adapter\",\"target\":\"" + input.trim() + "\",\"mode\":\"policy-gated\"}");
  }
}
