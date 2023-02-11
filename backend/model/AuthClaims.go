package model

import "github.com/golang-jwt/jwt"
type AuthClaims struct {
	UserId uint `json:"userId"`
	jwt.StandardClaims
}