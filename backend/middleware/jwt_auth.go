package middleware

import (
	"main/model"
	"main/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)
func JWTAuth() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		tokenStr :=ctx.GetHeader("Authorization")
		if tokenStr == "" {
			ctx.JSON(http.StatusForbidden,"No token. You don't have permission")
			ctx.Abort()
			return
		}
		// 解析拿到token
		token, err := utils.ParseToken(tokenStr)
		if err != nil {
			ctx.JSON(http.StatusForbidden, "Invalid token! You don't have permission!")
			ctx.Abort()
			return
		}

		// 拿到正确的token
		claims, ok:=token.Claims.(*model.AuthClaims)
		if !ok {
			ctx.JSON(http.StatusForbidden, "Invalid token!")
			ctx.Abort()
			return
		}

		ctx.Set("UserId", claims.UserId)
		// 继续
		ctx.Next()
	}
}