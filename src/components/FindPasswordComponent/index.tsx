import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { membersApi } from '../../api/member';
import { Styled } from '../../styled-components/AuthStyle';

const errorMessages = {
  emptyFields: '이메일과 휴대폰 번호를 모두 입력해주세요.',
  invalidFields: '이메일, 전화번호를 다시 확인해주세요!',
  success: '이메일로 비밀번호 재설정 링크를 보냈습니다.',
};

export default function FindPasswordForm() {
  const [formData, setFormData] = useState({
    email: '',
    phoneNumber: '',
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.email || !formData.phoneNumber) {
      setError(errorMessages.emptyFields);
      return;
    }

    try {
      // 서버로 이메일과 휴대폰 번호 전송
      await membersApi.requestPasswordReset(formData);
      setSuccessMessage(errorMessages.success);
      setError('');
    } catch (error) {
      console.error('비밀번호 찾기 요청 실패:', error);
      setError(errorMessages.invalidFields);
      setSuccessMessage('');
    }
  };

  return (
    <Styled.OuterWrapper>
      <Styled.Wrapper>
        <Styled.Title>비밀번호 찾기</Styled.Title>
        <Styled.Form onSubmit={handleSubmit}>
          <Styled.Input
            name="email"
            placeholder="이메일"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
          <Styled.Input
            name="phoneNumber"
            placeholder="전화번호"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
          <Styled.Input type="submit" value="인증하기" />
          {error && <Styled.ErrorMessage>{error}</Styled.ErrorMessage>}
          {successMessage && (
            <Styled.ErrorMessage>{successMessage}</Styled.ErrorMessage>
          )}
        </Styled.Form>
        <Styled.Switcher>
          로그인페이지로 <Link to="/signin">로그인페이지로 이동</Link>
        </Styled.Switcher>
      </Styled.Wrapper>
    </Styled.OuterWrapper>
  );
}
