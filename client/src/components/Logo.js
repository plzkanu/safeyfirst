import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';

const Logo = () => {
  const [imageError, setImageError] = useState(false);
  
  // SOOSAN 로고 이미지 경로 (여러 형식 지원)
  // client/public/ 폴더에 다음 이름 중 하나로 이미지를 추가하세요:
  // logo.png, logo.jpg, logo.svg, soosan-logo.png 등
  const logoImage = '/logo.png';
  
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
      }}
    >
      {!imageError ? (
        <img 
          src={logoImage} 
          alt="SOOSAN" 
          style={{ 
            height: '36px', 
            maxWidth: '100%',
            width: 'auto',
            objectFit: 'contain',
            display: 'block',
          }}
          onError={() => {
            // 이미지 로드 실패 시 텍스트 로고로 대체
            setImageError(true);
          }}
        />
      ) : (
        <Typography
          variant="h6"
          component="div"
          sx={{
            fontWeight: 'bold',
            fontSize: '1.5rem',
            letterSpacing: '0.1em',
            // SOOSAN 로고 스타일: 첫 번째 O와 두 번째 O에 그라데이션 효과
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            position: 'relative',
          }}
        >
          SOOSAN
        </Typography>
      )}
    </Box>
  );
};

export default Logo;

