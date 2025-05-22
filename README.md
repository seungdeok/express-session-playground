# express-session-playground

## 로그인 기능 데모 개발

<br />

### 시작 가이드.

#### Requirements

For building and running the application you need: [Node.js](https://nodejs.org/en)

<br />

#### Installation

1. project clone

```bash
$ git clone https://github.com/seungdeok/express-session-playground
$ cd express-session-playground
```

2. node package download

```bash
$ npm install
# use pnpm
$ pnpm install
# use yarn
$ yarn install
```

3. run development server(http://localhost:8080)

```bash
$ npm run dev
```

<br />

### 기술 스택.

<img src="https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=black">
<img src="https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white">
<img src="https://img.shields.io/badge/express-000000?style=for-the-badge&logo=express&logoColor=white">

<br />

### 구현 기능

- [x] 회원가입
- [x] 로그인/로그아웃
- [x] XSS 방어: autoescape, httpOnly 쿠키
- [x] CSRF 방어: sameSite 쿠키 설정
- [x] 파일 기반 세션 저장

<br />
