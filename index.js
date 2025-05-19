import express from "express";
import cors from "cors";
import { DiscordOAuth2 } from "discord-oauth2";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/discord-auth", async (req, res) => {
  const { code, redirectUri } = req.body;
  if (!code) return res.status(400).json({ error: "Código de autorização ausente" });

  try {
    const oauth = new DiscordOAuth2({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      redirectUri,
    });

    const tokenResponse = await oauth.tokenRequest({
      code,
      scope: "identify",
      grantType: "authorization_code",
    });

    const user = await oauth.getUser(tokenResponse.access_token);

    res.json({
      id: user.id,
      username: user.username,
      discriminator: user.discriminator,
      avatar: user.avatar,
    });
  } catch (error) {
    res.status(500).json({ error: "Falha na autenticação com Discord", details: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor rodando na porta", PORT)); 
