const { exec } = require("child_process")

/** Helper function to open a URL in the browser */
function openURL(url) {
  const command =
    process.platform === "win32" ? "start" : process.platform === "darwin" ? "open" : "xdg-open"

  exec(`${command} ${url}`)
}

;[
  "http://localhost:3000",
  "http://localhost:3000?login=true",
  "http://localhost:3000?enter-login-code&email=test@test.com",
  "http://localhost:3000/partner?u=",
].forEach(openURL)
