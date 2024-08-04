import styled from 'styled-components';

const Wrapper = styled.footer`
  display: flex;
  width: 100%;
  height: 100px;
  border-top: 1px solid #dee2e6;
  background-color: white;
  padding: 20px;
  text-align: center;
  justify-content: center;
  margin-top: 100px;
  min-width: 1800px;
`;

const FooterBox = styled.div`
  display: flex;
  align-items: center;
  gap: 120px;
  color: white;
  white-space: nowrap;
  cursor: pointer;
`;

const FooterName = styled.div`
  color: #222;
  font-weight: bold;
  font-size: 40px;
  margin: 5px;
  padding: 15px;
  &:hover {
    transform: scale(1.05);
  }
`;

export default function LayoutFooter() {
  return (
    <Wrapper>
      <FooterBox>
        <FooterName>Fan-Tion</FooterName>
      </FooterBox>
    </Wrapper>
  );
}
