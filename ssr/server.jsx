import express from "express";
import render from "./render";

const app = express();

app.get(/.*/, async (req, res) => {
  const html = await render(req,res);
   if (!html) return;
  res.send(html);
});

app.listen(5000);
