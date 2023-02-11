package utils

import (
	"main/global"
	"main/model"
	"time"

	"github.com/golang-jwt/jwt"
)

func GenerateToken(userId uint, expireTime time.Time) (string, error) {
	claim:= model.AuthClaims{
		UserId: userId,
		StandardClaims: jwt.StandardClaims{
			// 过期时间
			ExpiresAt: expireTime.Unix(),
			// 签名时间
			IssuedAt: time.Now().Unix(),
			// 签名颁发
			Issuer: "server",
			// 签名主题
			Subject: "UserAuth",
		},
	}
	noSignedToken :=jwt.NewWithClaims(jwt.SigningMethodHS256,claim)
	return noSignedToken.SignedString(global.GSecurtKey)
}

func ParseToken(tokenStr string) (*jwt.Token, error) {
	return jwt.ParseWithClaims(tokenStr,&model.AuthClaims{},func(tk *jwt.Token) (interface{}, error){
		return global.GSecurtKey, nil
	})
}