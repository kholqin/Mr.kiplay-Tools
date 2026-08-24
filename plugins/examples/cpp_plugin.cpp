#include <iostream>
#include <string>

// Contoh aman: hanya membuat rencana review; tidak melakukan network I/O.
int main() {
  std::cout << R"({"plugin":"example.headers-review","status":"planned","manualValidationRequired":true,"actions":[]})" << '\n';
  return 0;
}
