import NaverLoginButton from '@components/NaverComponent/NaverLoginButton';
import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import { Link, useNavigate } from 'react-router-dom';
import { membersApi } from '../../api/member';
import { Styled } from '../../styled-components/AuthStyle';

const errorMessages = {
  emptyFields: '이메일 또는 비밀번호가 올바르지 않습니다.',
};

export default function SignInForm() {
  const navigate = useNavigate();
  const [, setCookie] = useCookies(['Authorization']);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { email, password } = formData;
    try {
      const response = await membersApi.signIn({ email, password });

      const expires = new Date();
      expires.setTime(expires.getTime() + 7200 * 1000); // 7200초 밀리초로 반환

      console.log(response);
      setCookie('Authorization', response.data.accessToken, {
        path: '/',
        expires,
      }); // 로그인 성공시 토큰 쿠키에 저장 하고 쿠키 시간 7200초 = 2시간

      // 로그인 성공 처리
      navigate('/');
    } catch (error) {
      console.error(error);
      // 로그인 실패 처리 (예: 에러 메시지 표시)
      setError(errorMessages.emptyFields);
    }
  };

  return (
    <Styled.OuterWrapper>
      <Styled.Wrapper>
        <Styled.Title>로그인</Styled.Title>
        <Styled.Form onSubmit={handleSubmit}>
          <Styled.Input
            name="email"
            placeholder="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
          <Styled.Input
            name="password"
            placeholder="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
          />
          {error && <Styled.ErrorMessage>{error}</Styled.ErrorMessage>}
          <Styled.Input type="submit" value="Sign In" />
        </Styled.Form>
        <NaverLoginButton />
        <Styled.Switcher>
          비밀번호를 잊어버리셨나요?{' '}
          <Link to="/findpassword">비밀번호 찾기</Link>
        </Styled.Switcher>
        <Styled.Switcher>
          회원이 아니신가요? <Link to="/signup">회원가입</Link>
        </Styled.Switcher>
      </Styled.Wrapper>
      <Styled.LogoLink to="/">
        <Styled.LogoImage src='/img/mainLogo2.png'/>
      </Styled.LogoLink>
    </Styled.OuterWrapper>
  );
}
