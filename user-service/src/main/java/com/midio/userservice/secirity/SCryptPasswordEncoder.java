package com.midio.userservice.secirity;

import com.lambdaworks.crypto.SCryptUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class SCryptPasswordEncoder implements PasswordEncoder {

    private static final int N = 16384;
    private static final int R = 8;
    private static final int P = 1;

    @Override
    public String encode(CharSequence rawPassword) {
        return SCryptUtil.scrypt(rawPassword.toString(), N, R, P);
    }

    @Override
    public boolean matches(CharSequence rawPassword, String encodedPassword) {
        return SCryptUtil.check(rawPassword.toString(), encodedPassword);
    }

}
