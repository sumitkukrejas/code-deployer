import { MAX_LEN } from "./constants";
function generate() {
    let ans = ""
    let subset = "1234567890abcdefghijklmnopqrsstuvwxyz"
    for (let i = 0; i < MAX_LEN; i++) {
        let random = Math.random() * subset.length;
        ans += subset.charAt(random)
    }
    return ans;
}

module.exports = generate;