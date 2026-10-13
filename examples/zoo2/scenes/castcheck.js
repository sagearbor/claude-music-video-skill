// Cast sheet: Pip in a few poses next to Clawd in the operator headset (a LOOP, not part of the video).
LOOPS.cast = t => {
  boilSeed('bg'); paint(rectPts(-50, -50, W + 100, H + 100), { wash: '#DCEFE6', ink: null });
  pip(300, 820, 26, { eyes: 'dot', mouth: 'smile' });
  pip(700, 820, 26, { eyes: 'narrow', mouth: 'flat', aR: .4, brows: 'angry' });
  pip(1100, 820, 26, { eyes: 'wide', mouth: 'O', hatUp: 1, aL: 1.3, aR: 1.3 });
  clawd(1550, 820, 26, { ...feel('smug', t), hat: 'headphones' });
  push(); translate(1550, 500); handset(30, 1.2); pop();
  karaoke(6);
};
LOOPS.cast.len = 2;
