package main

import (
  "bufio"
  "encoding/json"
  "fmt"
  "os"
  "regexp"
  "strings"
)

type Result struct { OK bool `json:"ok"`; Module string `json:"module"`; Target string `json:"target,omitempty"`; Mode string `json:"mode,omitempty"`; Error string `json:"error,omitempty"` }

func main() {
  line, _ := bufio.NewReader(os.Stdin).ReadString('\n')
  target := strings.TrimSpace(line)
  if !regexp.MustCompile(`^[A-Za-z0-9.-]{1,253}$`).MatchString(target) { emit(Result{OK:false, Error:"target tidak valid atau bukan hostname publik"}); return }
  emit(Result{OK:true, Module:"go-adapter", Target:target, Mode:"policy-gated"})
}
func emit(value Result) { data, _ := json.Marshal(value); fmt.Println(string(data)) }
