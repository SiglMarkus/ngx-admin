import { Injectable } from '@angular/core';

/**
 * Simple crypto service, so our user setting isn't saved in plain text -
 * this service is only there so we obfuscate the information - it can easily be decrypted,
 * so we dont store any relevant information from our user or any other information through this method
 */
@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  private secretKey = 'TwQgltRJ2lhHfmOtF7Rh87Fnkww0VtFH';

  constructor(
  ) {
  }

  encrypt(text: string): string {
    // Surrogate pair limit
    const bound = 0x10000;

    // Create string from character codes
    return String.fromCharCode.apply(null,
      // Turn string to character codes
      text.split('').map((v, i) => {
        // Get rotation from key
        const rotation = this.secretKey[i % this.secretKey.length].charCodeAt(0);

        // Return current character code + rotation
        return (v.charCodeAt(0) + rotation + bound) % bound;
      })
    );
  }

  decrypt(text: string): string {

    // Surrogate pair limit
    const bound = 0x10000;

    // Create string from character codes
    return String.fromCharCode.apply(null,
      // Turn string to character codes
      text.split('').map((v, i) => {
        // Get rotation from key
        let rotation = this.secretKey[i % this.secretKey.length].charCodeAt(0);

        rotation = -rotation;

        // Return current character code + rotation
        return (v.charCodeAt(0) + rotation + bound) % bound;
      })
    );
  }

}
