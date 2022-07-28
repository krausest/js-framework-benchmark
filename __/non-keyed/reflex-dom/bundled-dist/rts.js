var h$currentThread = null;
var h$stack = null;
var h$sp = 0;
var h$initStatic = [];
var h$staticThunks = {};
var h$staticThunksArr = [];
var h$regs = [];
var h$r1 = 0;
var h$r2 = 0;
var h$r3 = 0;
var h$r4 = 0;
var h$r5 = 0;
var h$r6 = 0;
var h$r7 = 0;
var h$r8 = 0;
var h$r9 = 0;
var h$r10 = 0;
var h$r11 = 0;
var h$r12 = 0;
var h$r13 = 0;
var h$r14 = 0;
var h$r15 = 0;
var h$r16 = 0;
var h$r17 = 0;
var h$r18 = 0;
var h$r19 = 0;
var h$r20 = 0;
var h$r21 = 0;
var h$r22 = 0;
var h$r23 = 0;
var h$r24 = 0;
var h$r25 = 0;
var h$r26 = 0;
var h$r27 = 0;
var h$r28 = 0;
var h$r29 = 0;
var h$r30 = 0;
var h$r31 = 0;
var h$r32 = 0;
function h$getReg(h$RTSD_0)
{
  switch (h$RTSD_0)
  {
    case (1):
      return h$r1;
    case (2):
      return h$r2;
    case (3):
      return h$r3;
    case (4):
      return h$r4;
    case (5):
      return h$r5;
    case (6):
      return h$r6;
    case (7):
      return h$r7;
    case (8):
      return h$r8;
    case (9):
      return h$r9;
    case (10):
      return h$r10;
    case (11):
      return h$r11;
    case (12):
      return h$r12;
    case (13):
      return h$r13;
    case (14):
      return h$r14;
    case (15):
      return h$r15;
    case (16):
      return h$r16;
    case (17):
      return h$r17;
    case (18):
      return h$r18;
    case (19):
      return h$r19;
    case (20):
      return h$r20;
    case (21):
      return h$r21;
    case (22):
      return h$r22;
    case (23):
      return h$r23;
    case (24):
      return h$r24;
    case (25):
      return h$r25;
    case (26):
      return h$r26;
    case (27):
      return h$r27;
    case (28):
      return h$r28;
    case (29):
      return h$r29;
    case (30):
      return h$r30;
    case (31):
      return h$r31;
    case (32):
      return h$r32;
    case (33):
      return h$regs[0];
    case (34):
      return h$regs[1];
    case (35):
      return h$regs[2];
    case (36):
      return h$regs[3];
    case (37):
      return h$regs[4];
    case (38):
      return h$regs[5];
    case (39):
      return h$regs[6];
    case (40):
      return h$regs[7];
    case (41):
      return h$regs[8];
    case (42):
      return h$regs[9];
    case (43):
      return h$regs[10];
    case (44):
      return h$regs[11];
    case (45):
      return h$regs[12];
    case (46):
      return h$regs[13];
    case (47):
      return h$regs[14];
    case (48):
      return h$regs[15];
    case (49):
      return h$regs[16];
    case (50):
      return h$regs[17];
    case (51):
      return h$regs[18];
    case (52):
      return h$regs[19];
    case (53):
      return h$regs[20];
    case (54):
      return h$regs[21];
    case (55):
      return h$regs[22];
    case (56):
      return h$regs[23];
    case (57):
      return h$regs[24];
    case (58):
      return h$regs[25];
    case (59):
      return h$regs[26];
    case (60):
      return h$regs[27];
    case (61):
      return h$regs[28];
    case (62):
      return h$regs[29];
    case (63):
      return h$regs[30];
    case (64):
      return h$regs[31];
    case (65):
      return h$regs[32];
    case (66):
      return h$regs[33];
    case (67):
      return h$regs[34];
    case (68):
      return h$regs[35];
    case (69):
      return h$regs[36];
    case (70):
      return h$regs[37];
    case (71):
      return h$regs[38];
    case (72):
      return h$regs[39];
    case (73):
      return h$regs[40];
    case (74):
      return h$regs[41];
    case (75):
      return h$regs[42];
    case (76):
      return h$regs[43];
    case (77):
      return h$regs[44];
    case (78):
      return h$regs[45];
    case (79):
      return h$regs[46];
    case (80):
      return h$regs[47];
    case (81):
      return h$regs[48];
    case (82):
      return h$regs[49];
    case (83):
      return h$regs[50];
    case (84):
      return h$regs[51];
    case (85):
      return h$regs[52];
    case (86):
      return h$regs[53];
    case (87):
      return h$regs[54];
    case (88):
      return h$regs[55];
    case (89):
      return h$regs[56];
    case (90):
      return h$regs[57];
    case (91):
      return h$regs[58];
    case (92):
      return h$regs[59];
    case (93):
      return h$regs[60];
    case (94):
      return h$regs[61];
    case (95):
      return h$regs[62];
    case (96):
      return h$regs[63];
    case (97):
      return h$regs[64];
    case (98):
      return h$regs[65];
    case (99):
      return h$regs[66];
    case (100):
      return h$regs[67];
    case (101):
      return h$regs[68];
    case (102):
      return h$regs[69];
    case (103):
      return h$regs[70];
    case (104):
      return h$regs[71];
    case (105):
      return h$regs[72];
    case (106):
      return h$regs[73];
    case (107):
      return h$regs[74];
    case (108):
      return h$regs[75];
    case (109):
      return h$regs[76];
    case (110):
      return h$regs[77];
    case (111):
      return h$regs[78];
    case (112):
      return h$regs[79];
    case (113):
      return h$regs[80];
    case (114):
      return h$regs[81];
    case (115):
      return h$regs[82];
    case (116):
      return h$regs[83];
    case (117):
      return h$regs[84];
    case (118):
      return h$regs[85];
    case (119):
      return h$regs[86];
    case (120):
      return h$regs[87];
    case (121):
      return h$regs[88];
    case (122):
      return h$regs[89];
    case (123):
      return h$regs[90];
    case (124):
      return h$regs[91];
    case (125):
      return h$regs[92];
    case (126):
      return h$regs[93];
    case (127):
      return h$regs[94];
    case (128):
      return h$regs[95];
    default:
  };
};
function h$setReg(h$RTSD_1, h$RTSD_2)
{
  switch (h$RTSD_1)
  {
    case (1):
      h$r1 = h$RTSD_2;
      return undefined;
    case (2):
      h$r2 = h$RTSD_2;
      return undefined;
    case (3):
      h$r3 = h$RTSD_2;
      return undefined;
    case (4):
      h$r4 = h$RTSD_2;
      return undefined;
    case (5):
      h$r5 = h$RTSD_2;
      return undefined;
    case (6):
      h$r6 = h$RTSD_2;
      return undefined;
    case (7):
      h$r7 = h$RTSD_2;
      return undefined;
    case (8):
      h$r8 = h$RTSD_2;
      return undefined;
    case (9):
      h$r9 = h$RTSD_2;
      return undefined;
    case (10):
      h$r10 = h$RTSD_2;
      return undefined;
    case (11):
      h$r11 = h$RTSD_2;
      return undefined;
    case (12):
      h$r12 = h$RTSD_2;
      return undefined;
    case (13):
      h$r13 = h$RTSD_2;
      return undefined;
    case (14):
      h$r14 = h$RTSD_2;
      return undefined;
    case (15):
      h$r15 = h$RTSD_2;
      return undefined;
    case (16):
      h$r16 = h$RTSD_2;
      return undefined;
    case (17):
      h$r17 = h$RTSD_2;
      return undefined;
    case (18):
      h$r18 = h$RTSD_2;
      return undefined;
    case (19):
      h$r19 = h$RTSD_2;
      return undefined;
    case (20):
      h$r20 = h$RTSD_2;
      return undefined;
    case (21):
      h$r21 = h$RTSD_2;
      return undefined;
    case (22):
      h$r22 = h$RTSD_2;
      return undefined;
    case (23):
      h$r23 = h$RTSD_2;
      return undefined;
    case (24):
      h$r24 = h$RTSD_2;
      return undefined;
    case (25):
      h$r25 = h$RTSD_2;
      return undefined;
    case (26):
      h$r26 = h$RTSD_2;
      return undefined;
    case (27):
      h$r27 = h$RTSD_2;
      return undefined;
    case (28):
      h$r28 = h$RTSD_2;
      return undefined;
    case (29):
      h$r29 = h$RTSD_2;
      return undefined;
    case (30):
      h$r30 = h$RTSD_2;
      return undefined;
    case (31):
      h$r31 = h$RTSD_2;
      return undefined;
    case (32):
      h$r32 = h$RTSD_2;
      return undefined;
    case (33):
      h$regs[0] = h$RTSD_2;
      return undefined;
    case (34):
      h$regs[1] = h$RTSD_2;
      return undefined;
    case (35):
      h$regs[2] = h$RTSD_2;
      return undefined;
    case (36):
      h$regs[3] = h$RTSD_2;
      return undefined;
    case (37):
      h$regs[4] = h$RTSD_2;
      return undefined;
    case (38):
      h$regs[5] = h$RTSD_2;
      return undefined;
    case (39):
      h$regs[6] = h$RTSD_2;
      return undefined;
    case (40):
      h$regs[7] = h$RTSD_2;
      return undefined;
    case (41):
      h$regs[8] = h$RTSD_2;
      return undefined;
    case (42):
      h$regs[9] = h$RTSD_2;
      return undefined;
    case (43):
      h$regs[10] = h$RTSD_2;
      return undefined;
    case (44):
      h$regs[11] = h$RTSD_2;
      return undefined;
    case (45):
      h$regs[12] = h$RTSD_2;
      return undefined;
    case (46):
      h$regs[13] = h$RTSD_2;
      return undefined;
    case (47):
      h$regs[14] = h$RTSD_2;
      return undefined;
    case (48):
      h$regs[15] = h$RTSD_2;
      return undefined;
    case (49):
      h$regs[16] = h$RTSD_2;
      return undefined;
    case (50):
      h$regs[17] = h$RTSD_2;
      return undefined;
    case (51):
      h$regs[18] = h$RTSD_2;
      return undefined;
    case (52):
      h$regs[19] = h$RTSD_2;
      return undefined;
    case (53):
      h$regs[20] = h$RTSD_2;
      return undefined;
    case (54):
      h$regs[21] = h$RTSD_2;
      return undefined;
    case (55):
      h$regs[22] = h$RTSD_2;
      return undefined;
    case (56):
      h$regs[23] = h$RTSD_2;
      return undefined;
    case (57):
      h$regs[24] = h$RTSD_2;
      return undefined;
    case (58):
      h$regs[25] = h$RTSD_2;
      return undefined;
    case (59):
      h$regs[26] = h$RTSD_2;
      return undefined;
    case (60):
      h$regs[27] = h$RTSD_2;
      return undefined;
    case (61):
      h$regs[28] = h$RTSD_2;
      return undefined;
    case (62):
      h$regs[29] = h$RTSD_2;
      return undefined;
    case (63):
      h$regs[30] = h$RTSD_2;
      return undefined;
    case (64):
      h$regs[31] = h$RTSD_2;
      return undefined;
    case (65):
      h$regs[32] = h$RTSD_2;
      return undefined;
    case (66):
      h$regs[33] = h$RTSD_2;
      return undefined;
    case (67):
      h$regs[34] = h$RTSD_2;
      return undefined;
    case (68):
      h$regs[35] = h$RTSD_2;
      return undefined;
    case (69):
      h$regs[36] = h$RTSD_2;
      return undefined;
    case (70):
      h$regs[37] = h$RTSD_2;
      return undefined;
    case (71):
      h$regs[38] = h$RTSD_2;
      return undefined;
    case (72):
      h$regs[39] = h$RTSD_2;
      return undefined;
    case (73):
      h$regs[40] = h$RTSD_2;
      return undefined;
    case (74):
      h$regs[41] = h$RTSD_2;
      return undefined;
    case (75):
      h$regs[42] = h$RTSD_2;
      return undefined;
    case (76):
      h$regs[43] = h$RTSD_2;
      return undefined;
    case (77):
      h$regs[44] = h$RTSD_2;
      return undefined;
    case (78):
      h$regs[45] = h$RTSD_2;
      return undefined;
    case (79):
      h$regs[46] = h$RTSD_2;
      return undefined;
    case (80):
      h$regs[47] = h$RTSD_2;
      return undefined;
    case (81):
      h$regs[48] = h$RTSD_2;
      return undefined;
    case (82):
      h$regs[49] = h$RTSD_2;
      return undefined;
    case (83):
      h$regs[50] = h$RTSD_2;
      return undefined;
    case (84):
      h$regs[51] = h$RTSD_2;
      return undefined;
    case (85):
      h$regs[52] = h$RTSD_2;
      return undefined;
    case (86):
      h$regs[53] = h$RTSD_2;
      return undefined;
    case (87):
      h$regs[54] = h$RTSD_2;
      return undefined;
    case (88):
      h$regs[55] = h$RTSD_2;
      return undefined;
    case (89):
      h$regs[56] = h$RTSD_2;
      return undefined;
    case (90):
      h$regs[57] = h$RTSD_2;
      return undefined;
    case (91):
      h$regs[58] = h$RTSD_2;
      return undefined;
    case (92):
      h$regs[59] = h$RTSD_2;
      return undefined;
    case (93):
      h$regs[60] = h$RTSD_2;
      return undefined;
    case (94):
      h$regs[61] = h$RTSD_2;
      return undefined;
    case (95):
      h$regs[62] = h$RTSD_2;
      return undefined;
    case (96):
      h$regs[63] = h$RTSD_2;
      return undefined;
    case (97):
      h$regs[64] = h$RTSD_2;
      return undefined;
    case (98):
      h$regs[65] = h$RTSD_2;
      return undefined;
    case (99):
      h$regs[66] = h$RTSD_2;
      return undefined;
    case (100):
      h$regs[67] = h$RTSD_2;
      return undefined;
    case (101):
      h$regs[68] = h$RTSD_2;
      return undefined;
    case (102):
      h$regs[69] = h$RTSD_2;
      return undefined;
    case (103):
      h$regs[70] = h$RTSD_2;
      return undefined;
    case (104):
      h$regs[71] = h$RTSD_2;
      return undefined;
    case (105):
      h$regs[72] = h$RTSD_2;
      return undefined;
    case (106):
      h$regs[73] = h$RTSD_2;
      return undefined;
    case (107):
      h$regs[74] = h$RTSD_2;
      return undefined;
    case (108):
      h$regs[75] = h$RTSD_2;
      return undefined;
    case (109):
      h$regs[76] = h$RTSD_2;
      return undefined;
    case (110):
      h$regs[77] = h$RTSD_2;
      return undefined;
    case (111):
      h$regs[78] = h$RTSD_2;
      return undefined;
    case (112):
      h$regs[79] = h$RTSD_2;
      return undefined;
    case (113):
      h$regs[80] = h$RTSD_2;
      return undefined;
    case (114):
      h$regs[81] = h$RTSD_2;
      return undefined;
    case (115):
      h$regs[82] = h$RTSD_2;
      return undefined;
    case (116):
      h$regs[83] = h$RTSD_2;
      return undefined;
    case (117):
      h$regs[84] = h$RTSD_2;
      return undefined;
    case (118):
      h$regs[85] = h$RTSD_2;
      return undefined;
    case (119):
      h$regs[86] = h$RTSD_2;
      return undefined;
    case (120):
      h$regs[87] = h$RTSD_2;
      return undefined;
    case (121):
      h$regs[88] = h$RTSD_2;
      return undefined;
    case (122):
      h$regs[89] = h$RTSD_2;
      return undefined;
    case (123):
      h$regs[90] = h$RTSD_2;
      return undefined;
    case (124):
      h$regs[91] = h$RTSD_2;
      return undefined;
    case (125):
      h$regs[92] = h$RTSD_2;
      return undefined;
    case (126):
      h$regs[93] = h$RTSD_2;
      return undefined;
    case (127):
      h$regs[94] = h$RTSD_2;
      return undefined;
    case (128):
      h$regs[95] = h$RTSD_2;
      return undefined;
    default:
  };
};
function h$l1(x1)
{
  h$r1 = x1;
};
function h$l2(x1, x2)
{
  h$r2 = x1;
  h$r1 = x2;
};
function h$l3(x1, x2, x3)
{
  h$r3 = x1;
  h$r2 = x2;
  h$r1 = x3;
};
function h$l4(x1, x2, x3, x4)
{
  h$r4 = x1;
  h$r3 = x2;
  h$r2 = x3;
  h$r1 = x4;
};
function h$l5(x1, x2, x3, x4, x5)
{
  h$r5 = x1;
  h$r4 = x2;
  h$r3 = x3;
  h$r2 = x4;
  h$r1 = x5;
};
function h$l6(x1, x2, x3, x4, x5, x6)
{
  h$r6 = x1;
  h$r5 = x2;
  h$r4 = x3;
  h$r3 = x4;
  h$r2 = x5;
  h$r1 = x6;
};
function h$l7(x1, x2, x3, x4, x5, x6, x7)
{
  h$r7 = x1;
  h$r6 = x2;
  h$r5 = x3;
  h$r4 = x4;
  h$r3 = x5;
  h$r2 = x6;
  h$r1 = x7;
};
function h$l8(x1, x2, x3, x4, x5, x6, x7, x8)
{
  h$r8 = x1;
  h$r7 = x2;
  h$r6 = x3;
  h$r5 = x4;
  h$r4 = x5;
  h$r3 = x6;
  h$r2 = x7;
  h$r1 = x8;
};
function h$l9(x1, x2, x3, x4, x5, x6, x7, x8, x9)
{
  h$r9 = x1;
  h$r8 = x2;
  h$r7 = x3;
  h$r6 = x4;
  h$r5 = x5;
  h$r4 = x6;
  h$r3 = x7;
  h$r2 = x8;
  h$r1 = x9;
};
function h$l10(x1, x2, x3, x4, x5, x6, x7, x8, x9, x10)
{
  h$r10 = x1;
  h$r9 = x2;
  h$r8 = x3;
  h$r7 = x4;
  h$r6 = x5;
  h$r5 = x6;
  h$r4 = x7;
  h$r3 = x8;
  h$r2 = x9;
  h$r1 = x10;
};
function h$l11(x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11)
{
  h$r11 = x1;
  h$r10 = x2;
  h$r9 = x3;
  h$r8 = x4;
  h$r7 = x5;
  h$r6 = x6;
  h$r5 = x7;
  h$r4 = x8;
  h$r3 = x9;
  h$r2 = x10;
  h$r1 = x11;
};
function h$l12(x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12)
{
  h$r12 = x1;
  h$r11 = x2;
  h$r10 = x3;
  h$r9 = x4;
  h$r8 = x5;
  h$r7 = x6;
  h$r6 = x7;
  h$r5 = x8;
  h$r4 = x9;
  h$r3 = x10;
  h$r2 = x11;
  h$r1 = x12;
};
function h$l13(x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13)
{
  h$r13 = x1;
  h$r12 = x2;
  h$r11 = x3;
  h$r10 = x4;
  h$r9 = x5;
  h$r8 = x6;
  h$r7 = x7;
  h$r6 = x8;
  h$r5 = x9;
  h$r4 = x10;
  h$r3 = x11;
  h$r2 = x12;
  h$r1 = x13;
};
function h$l14(x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14)
{
  h$r14 = x1;
  h$r13 = x2;
  h$r12 = x3;
  h$r11 = x4;
  h$r10 = x5;
  h$r9 = x6;
  h$r8 = x7;
  h$r7 = x8;
  h$r6 = x9;
  h$r5 = x10;
  h$r4 = x11;
  h$r3 = x12;
  h$r2 = x13;
  h$r1 = x14;
};
function h$l15(x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15)
{
  h$r15 = x1;
  h$r14 = x2;
  h$r13 = x3;
  h$r12 = x4;
  h$r11 = x5;
  h$r10 = x6;
  h$r9 = x7;
  h$r8 = x8;
  h$r7 = x9;
  h$r6 = x10;
  h$r5 = x11;
  h$r4 = x12;
  h$r3 = x13;
  h$r2 = x14;
  h$r1 = x15;
};
function h$l16(x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15, x16)
{
  h$r16 = x1;
  h$r15 = x2;
  h$r14 = x3;
  h$r13 = x4;
  h$r12 = x5;
  h$r11 = x6;
  h$r10 = x7;
  h$r9 = x8;
  h$r8 = x9;
  h$r7 = x10;
  h$r6 = x11;
  h$r5 = x12;
  h$r4 = x13;
  h$r3 = x14;
  h$r2 = x15;
  h$r1 = x16;
};
function h$l17(x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15, x16, x17)
{
  h$r17 = x1;
  h$r16 = x2;
  h$r15 = x3;
  h$r14 = x4;
  h$r13 = x5;
  h$r12 = x6;
  h$r11 = x7;
  h$r10 = x8;
  h$r9 = x9;
  h$r8 = x10;
  h$r7 = x11;
  h$r6 = x12;
  h$r5 = x13;
  h$r4 = x14;
  h$r3 = x15;
  h$r2 = x16;
  h$r1 = x17;
};
function h$l18(x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15, x16, x17, x18)
{
  h$r18 = x1;
  h$r17 = x2;
  h$r16 = x3;
  h$r15 = x4;
  h$r14 = x5;
  h$r13 = x6;
  h$r12 = x7;
  h$r11 = x8;
  h$r10 = x9;
  h$r9 = x10;
  h$r8 = x11;
  h$r7 = x12;
  h$r6 = x13;
  h$r5 = x14;
  h$r4 = x15;
  h$r3 = x16;
  h$r2 = x17;
  h$r1 = x18;
};
function h$l19(x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15, x16, x17, x18, x19)
{
  h$r19 = x1;
  h$r18 = x2;
  h$r17 = x3;
  h$r16 = x4;
  h$r15 = x5;
  h$r14 = x6;
  h$r13 = x7;
  h$r12 = x8;
  h$r11 = x9;
  h$r10 = x10;
  h$r9 = x11;
  h$r8 = x12;
  h$r7 = x13;
  h$r6 = x14;
  h$r5 = x15;
  h$r4 = x16;
  h$r3 = x17;
  h$r2 = x18;
  h$r1 = x19;
};
function h$l20(x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15, x16, x17, x18, x19, x20)
{
  h$r20 = x1;
  h$r19 = x2;
  h$r18 = x3;
  h$r17 = x4;
  h$r16 = x5;
  h$r15 = x6;
  h$r14 = x7;
  h$r13 = x8;
  h$r12 = x9;
  h$r11 = x10;
  h$r10 = x11;
  h$r9 = x12;
  h$r8 = x13;
  h$r7 = x14;
  h$r6 = x15;
  h$r5 = x16;
  h$r4 = x17;
  h$r3 = x18;
  h$r2 = x19;
  h$r1 = x20;
};
function h$l21(x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15, x16, x17, x18, x19, x20, x21)
{
  h$r21 = x1;
  h$r20 = x2;
  h$r19 = x3;
  h$r18 = x4;
  h$r17 = x5;
  h$r16 = x6;
  h$r15 = x7;
  h$r14 = x8;
  h$r13 = x9;
  h$r12 = x10;
  h$r11 = x11;
  h$r10 = x12;
  h$r9 = x13;
  h$r8 = x14;
  h$r7 = x15;
  h$r6 = x16;
  h$r5 = x17;
  h$r4 = x18;
  h$r3 = x19;
  h$r2 = x20;
  h$r1 = x21;
};
function h$l22(x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15, x16, x17, x18, x19, x20, x21, x22)
{
  h$r22 = x1;
  h$r21 = x2;
  h$r20 = x3;
  h$r19 = x4;
  h$r18 = x5;
  h$r17 = x6;
  h$r16 = x7;
  h$r15 = x8;
  h$r14 = x9;
  h$r13 = x10;
  h$r12 = x11;
  h$r11 = x12;
  h$r10 = x13;
  h$r9 = x14;
  h$r8 = x15;
  h$r7 = x16;
  h$r6 = x17;
  h$r5 = x18;
  h$r4 = x19;
  h$r3 = x20;
  h$r2 = x21;
  h$r1 = x22;
};
function h$l23(x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15, x16, x17, x18, x19, x20, x21, x22, x23)
{
  h$r23 = x1;
  h$r22 = x2;
  h$r21 = x3;
  h$r20 = x4;
  h$r19 = x5;
  h$r18 = x6;
  h$r17 = x7;
  h$r16 = x8;
  h$r15 = x9;
  h$r14 = x10;
  h$r13 = x11;
  h$r12 = x12;
  h$r11 = x13;
  h$r10 = x14;
  h$r9 = x15;
  h$r8 = x16;
  h$r7 = x17;
  h$r6 = x18;
  h$r5 = x19;
  h$r4 = x20;
  h$r3 = x21;
  h$r2 = x22;
  h$r1 = x23;
};
function h$l24(x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15, x16, x17, x18, x19, x20, x21, x22, x23,
x24)
{
  h$r24 = x1;
  h$r23 = x2;
  h$r22 = x3;
  h$r21 = x4;
  h$r20 = x5;
  h$r19 = x6;
  h$r18 = x7;
  h$r17 = x8;
  h$r16 = x9;
  h$r15 = x10;
  h$r14 = x11;
  h$r13 = x12;
  h$r12 = x13;
  h$r11 = x14;
  h$r10 = x15;
  h$r9 = x16;
  h$r8 = x17;
  h$r7 = x18;
  h$r6 = x19;
  h$r5 = x20;
  h$r4 = x21;
  h$r3 = x22;
  h$r2 = x23;
  h$r1 = x24;
};
function h$l25(x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15, x16, x17, x18, x19, x20, x21, x22, x23,
x24, x25)
{
  h$r25 = x1;
  h$r24 = x2;
  h$r23 = x3;
  h$r22 = x4;
  h$r21 = x5;
  h$r20 = x6;
  h$r19 = x7;
  h$r18 = x8;
  h$r17 = x9;
  h$r16 = x10;
  h$r15 = x11;
  h$r14 = x12;
  h$r13 = x13;
  h$r12 = x14;
  h$r11 = x15;
  h$r10 = x16;
  h$r9 = x17;
  h$r8 = x18;
  h$r7 = x19;
  h$r6 = x20;
  h$r5 = x21;
  h$r4 = x22;
  h$r3 = x23;
  h$r2 = x24;
  h$r1 = x25;
};
function h$l26(x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15, x16, x17, x18, x19, x20, x21, x22, x23,
x24, x25, x26)
{
  h$r26 = x1;
  h$r25 = x2;
  h$r24 = x3;
  h$r23 = x4;
  h$r22 = x5;
  h$r21 = x6;
  h$r20 = x7;
  h$r19 = x8;
  h$r18 = x9;
  h$r17 = x10;
  h$r16 = x11;
  h$r15 = x12;
  h$r14 = x13;
  h$r13 = x14;
  h$r12 = x15;
  h$r11 = x16;
  h$r10 = x17;
  h$r9 = x18;
  h$r8 = x19;
  h$r7 = x20;
  h$r6 = x21;
  h$r5 = x22;
  h$r4 = x23;
  h$r3 = x24;
  h$r2 = x25;
  h$r1 = x26;
};
function h$l27(x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15, x16, x17, x18, x19, x20, x21, x22, x23,
x24, x25, x26, x27)
{
  h$r27 = x1;
  h$r26 = x2;
  h$r25 = x3;
  h$r24 = x4;
  h$r23 = x5;
  h$r22 = x6;
  h$r21 = x7;
  h$r20 = x8;
  h$r19 = x9;
  h$r18 = x10;
  h$r17 = x11;
  h$r16 = x12;
  h$r15 = x13;
  h$r14 = x14;
  h$r13 = x15;
  h$r12 = x16;
  h$r11 = x17;
  h$r10 = x18;
  h$r9 = x19;
  h$r8 = x20;
  h$r7 = x21;
  h$r6 = x22;
  h$r5 = x23;
  h$r4 = x24;
  h$r3 = x25;
  h$r2 = x26;
  h$r1 = x27;
};
function h$l28(x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15, x16, x17, x18, x19, x20, x21, x22, x23,
x24, x25, x26, x27, x28)
{
  h$r28 = x1;
  h$r27 = x2;
  h$r26 = x3;
  h$r25 = x4;
  h$r24 = x5;
  h$r23 = x6;
  h$r22 = x7;
  h$r21 = x8;
  h$r20 = x9;
  h$r19 = x10;
  h$r18 = x11;
  h$r17 = x12;
  h$r16 = x13;
  h$r15 = x14;
  h$r14 = x15;
  h$r13 = x16;
  h$r12 = x17;
  h$r11 = x18;
  h$r10 = x19;
  h$r9 = x20;
  h$r8 = x21;
  h$r7 = x22;
  h$r6 = x23;
  h$r5 = x24;
  h$r4 = x25;
  h$r3 = x26;
  h$r2 = x27;
  h$r1 = x28;
};
function h$l29(x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15, x16, x17, x18, x19, x20, x21, x22, x23,
x24, x25, x26, x27, x28, x29)
{
  h$r29 = x1;
  h$r28 = x2;
  h$r27 = x3;
  h$r26 = x4;
  h$r25 = x5;
  h$r24 = x6;
  h$r23 = x7;
  h$r22 = x8;
  h$r21 = x9;
  h$r20 = x10;
  h$r19 = x11;
  h$r18 = x12;
  h$r17 = x13;
  h$r16 = x14;
  h$r15 = x15;
  h$r14 = x16;
  h$r13 = x17;
  h$r12 = x18;
  h$r11 = x19;
  h$r10 = x20;
  h$r9 = x21;
  h$r8 = x22;
  h$r7 = x23;
  h$r6 = x24;
  h$r5 = x25;
  h$r4 = x26;
  h$r3 = x27;
  h$r2 = x28;
  h$r1 = x29;
};
function h$l30(x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15, x16, x17, x18, x19, x20, x21, x22, x23,
x24, x25, x26, x27, x28, x29, x30)
{
  h$r30 = x1;
  h$r29 = x2;
  h$r28 = x3;
  h$r27 = x4;
  h$r26 = x5;
  h$r25 = x6;
  h$r24 = x7;
  h$r23 = x8;
  h$r22 = x9;
  h$r21 = x10;
  h$r20 = x11;
  h$r19 = x12;
  h$r18 = x13;
  h$r17 = x14;
  h$r16 = x15;
  h$r15 = x16;
  h$r14 = x17;
  h$r13 = x18;
  h$r12 = x19;
  h$r11 = x20;
  h$r10 = x21;
  h$r9 = x22;
  h$r8 = x23;
  h$r7 = x24;
  h$r6 = x25;
  h$r5 = x26;
  h$r4 = x27;
  h$r3 = x28;
  h$r2 = x29;
  h$r1 = x30;
};
function h$l31(x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15, x16, x17, x18, x19, x20, x21, x22, x23,
x24, x25, x26, x27, x28, x29, x30, x31)
{
  h$r31 = x1;
  h$r30 = x2;
  h$r29 = x3;
  h$r28 = x4;
  h$r27 = x5;
  h$r26 = x6;
  h$r25 = x7;
  h$r24 = x8;
  h$r23 = x9;
  h$r22 = x10;
  h$r21 = x11;
  h$r20 = x12;
  h$r19 = x13;
  h$r18 = x14;
  h$r17 = x15;
  h$r16 = x16;
  h$r15 = x17;
  h$r14 = x18;
  h$r13 = x19;
  h$r12 = x20;
  h$r11 = x21;
  h$r10 = x22;
  h$r9 = x23;
  h$r8 = x24;
  h$r7 = x25;
  h$r6 = x26;
  h$r5 = x27;
  h$r4 = x28;
  h$r3 = x29;
  h$r2 = x30;
  h$r1 = x31;
};
function h$l32(x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15, x16, x17, x18, x19, x20, x21, x22, x23,
x24, x25, x26, x27, x28, x29, x30, x31, x32)
{
  h$r32 = x1;
  h$r31 = x2;
  h$r30 = x3;
  h$r29 = x4;
  h$r28 = x5;
  h$r27 = x6;
  h$r26 = x7;
  h$r25 = x8;
  h$r24 = x9;
  h$r23 = x10;
  h$r22 = x11;
  h$r21 = x12;
  h$r20 = x13;
  h$r19 = x14;
  h$r18 = x15;
  h$r17 = x16;
  h$r16 = x17;
  h$r15 = x18;
  h$r14 = x19;
  h$r13 = x20;
  h$r12 = x21;
  h$r11 = x22;
  h$r10 = x23;
  h$r9 = x24;
  h$r8 = x25;
  h$r7 = x26;
  h$r6 = x27;
  h$r5 = x28;
  h$r4 = x29;
  h$r3 = x30;
  h$r2 = x31;
  h$r1 = x32;
};
var h$ret1;
var h$ret2;
var h$ret3;
var h$ret4;
var h$ret5;
var h$ret6;
var h$ret7;
var h$ret8;
var h$ret9;
var h$ret10;

/* platform-specific setup */

// top-level debug initialization needs this. declare it in case we aren't in the same file as out.js
function h$ghcjszmprimZCGHCJSziPrimziJSVal_con_e() { return h$stack[h$sp]; };

/*
   if browser mode is active (GHCJS_BROWSER is defined), all the runtime platform
   detection code should be removed by the preprocessor. The h$isPlatform variables
   are undeclared.

   in non-browser mode, use h$isNode, h$isJsShell, h$isBrowser to find the current
   platform.

   more platforms should be added here in the future
*/
function h$getGlobal(that) {
    if(typeof global !== 'undefined') return global;
    return that;
}


// IE 8 doesn't support Date.now(), shim it
if (!Date.now) {
  Date.now = function now() {
    return +(new Date);
  };
}
/*
  set up the google closure library. this is a rather hacky setup
  to make it work with our shims without requiring compilation
  or pulling in the google closure library module loader
 */
var goog = {};
goog.global = h$getGlobal(this);
goog.provide = function() { };
goog.require = function() { };
goog.isDef = function(val) { return val !== undefined; };
goog.inherits = function(childCtor, parentCtor) {
  /** @constructor */
  function tempCtor() {};
  tempCtor.prototype = parentCtor.prototype;
  childCtor.superClass_ = parentCtor.prototype;
  childCtor.prototype = new tempCtor();
  /** @override */
  childCtor.prototype.constructor = childCtor;

  /**
   * Calls superclass constructor/method.
   *
   * This function is only available if you use goog.inherits to
   * express inheritance relationships between classes.
   *
   * NOTE: This is a replacement for goog.base and for superClass_
   * property defined in childCtor.
   *
   * @param {!Object} me Should always be "this".
   * @param {string} methodName The method name to call. Calling
   *     superclass constructor can be done with the special string
   *     'constructor'.
   * @param {...*} var_args The arguments to pass to superclass
   *     method/constructor.
   * @return {*} The return value of the superclass method/constructor.
   */
  childCtor.base = function(me, methodName, var_args) {
    // Copying using loop to avoid deop due to passing arguments object to
    // function. This is faster in many JS engines as of late 2014.
    var args = new Array(arguments.length - 2);
    for (var i = 2; i < arguments.length; i++) {
      args[i - 2] = arguments[i];
    }
    return parentCtor.prototype[methodName].apply(me, args);
  };
};

goog.isString = function(v) {
    return typeof v === 'string';
}

goog.math = {};
goog.crypt = {};
/*
 Copyright (c) 2010, Linden Research, Inc.
 Copyright (c) 2014, Joshua Bell

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 $/LicenseInfo$
 */

// Original can be found at:
//   https://bitbucket.org/lindenlab/llsd
// Modifications by Joshua Bell inexorabletash@gmail.com
//   https://github.com/inexorabletash/polyfill

// ES3/ES5 implementation of the Krhonos Typed Array Specification
//   Ref: http://www.khronos.org/registry/typedarray/specs/latest/
//   Date: 2011-02-01
//
// Variations:
//  * Allows typed_array.get/set() as alias for subscripts (typed_array[])
//  * Gradually migrating structure from Khronos spec to ES6 spec
(function(global) {
  'use strict';
  var undefined = (void 0); // Paranoia

  // Beyond this value, index getters/setters (i.e. array[0], array[1]) are so slow to
  // create, and consume so much memory, that the browser appears frozen.
  var MAX_ARRAY_LENGTH = 1e5;

  // Approximations of internal ECMAScript conversion functions
  function Type(v) {
    switch(typeof v) {
    case 'undefined': return 'undefined';
    case 'boolean': return 'boolean';
    case 'number': return 'number';
    case 'string': return 'string';
    default: return v === null ? 'null' : 'object';
    }
  }

  // Class returns internal [[Class]] property, used to avoid cross-frame instanceof issues:
  function Class(v) { return Object.prototype.toString.call(v).replace(/^\[object *|\]$/g, ''); }
  function IsCallable(o) { return typeof o === 'function'; }
  function ToObject(v) {
    if (v === null || v === undefined) throw TypeError();
    return Object(v);
  }
  function ToInt32(v) { return v >> 0; }
  function ToUint32(v) { return v >>> 0; }

  // Snapshot intrinsics
  var LN2 = Math.LN2,
      abs = Math.abs,
      floor = Math.floor,
      log = Math.log,
      max = Math.max,
      min = Math.min,
      pow = Math.pow,
      round = Math.round;

  // emulate ES5 getter/setter API using legacy APIs
  // http://blogs.msdn.com/b/ie/archive/2010/09/07/transitioning-existing-code-to-the-es5-getter-setter-apis.aspx
  // (second clause tests for Object.defineProperty() in IE<9 that only supports extending DOM prototypes, but
  // note that IE<9 does not support __defineGetter__ or __defineSetter__ so it just renders the method harmless)

  (function() {
    var orig = Object.defineProperty;
    var dom_only = !(function(){try{return Object.defineProperty({},'x',{});}catch(_){return false;}}());

    if (!orig || dom_only) {
      Object.defineProperty = function (o, prop, desc) {
        // In IE8 try built-in implementation for defining properties on DOM prototypes.
        if (orig)
          try { return orig(o, prop, desc); } catch (_) {}
        if (o !== Object(o))
          throw TypeError('Object.defineProperty called on non-object');
        if (Object.prototype.__defineGetter__ && ('get' in desc))
          Object.prototype.__defineGetter__.call(o, prop, desc.get);
        if (Object.prototype.__defineSetter__ && ('set' in desc))
          Object.prototype.__defineSetter__.call(o, prop, desc.set);
        if ('value' in desc)
          o[prop] = desc.value;
        return o;
      };
    }
  }());

  // ES5: Make obj[index] an alias for obj._getter(index)/obj._setter(index, value)
  // for index in 0 ... obj.length
  function makeArrayAccessors(obj) {
    if (obj.length > MAX_ARRAY_LENGTH) throw RangeError('Array too large for polyfill');

    function makeArrayAccessor(index) {
      Object.defineProperty(obj, index, {
        'get': function() { return obj._getter(index); },
        'set': function(v) { obj._setter(index, v); },
        enumerable: true,
        configurable: false
      });
    }

    var i;
    for (i = 0; i < obj.length; i += 1) {
      makeArrayAccessor(i);
    }
  }

  // Internal conversion functions:
  //    pack<Type>()   - take a number (interpreted as Type), output a byte array
  //    unpack<Type>() - take a byte array, output a Type-like number

  function as_signed(value, bits) { var s = 32 - bits; return (value << s) >> s; }
  function as_unsigned(value, bits) { var s = 32 - bits; return (value << s) >>> s; }

  function packI8(n) { return [n & 0xff]; }
  function unpackI8(bytes) { return as_signed(bytes[0], 8); }

  function packU8(n) { return [n & 0xff]; }
  function unpackU8(bytes) { return as_unsigned(bytes[0], 8); }

  function packU8Clamped(n) { n = round(Number(n)); return [n < 0 ? 0 : n > 0xff ? 0xff : n & 0xff]; }

  function packI16(n) { return [n & 0xff, (n >> 8) & 0xff]; }
  function unpackI16(bytes) { return as_signed(bytes[1] << 8 | bytes[0], 16); }

  function packU16(n) { return [n & 0xff, (n >> 8) & 0xff]; }
  function unpackU16(bytes) { return as_unsigned(bytes[1] << 8 | bytes[0], 16); }

  function packI32(n) { return [n & 0xff, (n >> 8) & 0xff, (n >> 16) & 0xff, (n >> 24) & 0xff]; }
  function unpackI32(bytes) { return as_signed(bytes[3] << 24 | bytes[2] << 16 | bytes[1] << 8 | bytes[0], 32); }

  function packU32(n) { return [n & 0xff, (n >> 8) & 0xff, (n >> 16) & 0xff, (n >> 24) & 0xff]; }
  function unpackU32(bytes) { return as_unsigned(bytes[3] << 24 | bytes[2] << 16 | bytes[1] << 8 | bytes[0], 32); }

  function packIEEE754(v, ebits, fbits) {

    var bias = (1 << (ebits - 1)) - 1,
        s, e, f, ln,
        i, bits, str, bytes;

    function roundToEven(n) {
      var w = floor(n), f = n - w;
      if (f < 0.5)
        return w;
      if (f > 0.5)
        return w + 1;
      return w % 2 ? w + 1 : w;
    }

    // Compute sign, exponent, fraction
    if (v !== v) {
      // NaN
      // http://dev.w3.org/2006/webapi/WebIDL/#es-type-mapping
      e = (1 << ebits) - 1; f = pow(2, fbits - 1); s = 0;
    } else if (v === Infinity || v === -Infinity) {
      e = (1 << ebits) - 1; f = 0; s = (v < 0) ? 1 : 0;
    } else if (v === 0) {
      e = 0; f = 0; s = (1 / v === -Infinity) ? 1 : 0;
    } else {
      s = v < 0;
      v = abs(v);

      if (v >= pow(2, 1 - bias)) {
        e = min(floor(log(v) / LN2), 1023);
        var significand = v / pow(2, e);
        if (significand < 1) {
          e -= 1;
          significand *= 2;
        }
        if (significand >= 2) {
          e += 1;
          significand /= 2;
        }
        f = roundToEven(significand * pow(2, fbits));
        if (f / pow(2, fbits) >= 2) {
          e = e + 1;
          f = 1;
        }
        if (e > bias) {
          // Overflow
          e = (1 << ebits) - 1;
          f = 0;
        } else {
          // Normalized
          e = e + bias;
          f = f - pow(2, fbits);
        }
      } else {
        // Denormalized
        e = 0;
        f = roundToEven(v / pow(2, 1 - bias - fbits));
      }
    }

    // Pack sign, exponent, fraction
    bits = [];
    for (i = fbits; i; i -= 1) { bits.push(f % 2 ? 1 : 0); f = floor(f / 2); }
    for (i = ebits; i; i -= 1) { bits.push(e % 2 ? 1 : 0); e = floor(e / 2); }
    bits.push(s ? 1 : 0);
    bits.reverse();
    str = bits.join('');

    // Bits to bytes
    bytes = [];
    while (str.length) {
      bytes.unshift(parseInt(str.substring(0, 8), 2));
      str = str.substring(8);
    }
    return bytes;
  }

  function unpackIEEE754(bytes, ebits, fbits) {
    // Bytes to bits
    var bits = [], i, j, b, str,
        bias, s, e, f;

    for (i = 0; i < bytes.length; ++i) {
      b = bytes[i];
      for (j = 8; j; j -= 1) {
        bits.push(b % 2 ? 1 : 0); b = b >> 1;
      }
    }
    bits.reverse();
    str = bits.join('');

    // Unpack sign, exponent, fraction
    bias = (1 << (ebits - 1)) - 1;
    s = parseInt(str.substring(0, 1), 2) ? -1 : 1;
    e = parseInt(str.substring(1, 1 + ebits), 2);
    f = parseInt(str.substring(1 + ebits), 2);

    // Produce number
    if (e === (1 << ebits) - 1) {
      return f !== 0 ? NaN : s * Infinity;
    } else if (e > 0) {
      // Normalized
      return s * pow(2, e - bias) * (1 + f / pow(2, fbits));
    } else if (f !== 0) {
      // Denormalized
      return s * pow(2, -(bias - 1)) * (f / pow(2, fbits));
    } else {
      return s < 0 ? -0 : 0;
    }
  }

  function unpackF64(b) { return unpackIEEE754(b, 11, 52); }
  function packF64(v) { return packIEEE754(v, 11, 52); }
  function unpackF32(b) { return unpackIEEE754(b, 8, 23); }
  function packF32(v) { return packIEEE754(v, 8, 23); }

  //
  // 3 The ArrayBuffer Type
  //

  (function() {

    function ArrayBuffer(length) {
      length = ToInt32(length);
      if (length < 0) throw RangeError('ArrayBuffer size is not a small enough positive integer.');
      Object.defineProperty(this, 'byteLength', {value: length});
      Object.defineProperty(this, '_bytes', {value: Array(length)});

      for (var i = 0; i < length; i += 1)
        this._bytes[i] = 0;
    }

    global.ArrayBuffer = global.ArrayBuffer || ArrayBuffer;

    //
    // 5 The Typed Array View Types
    //

    function $TypedArray$() {

      // %TypedArray% ( length )
      if (!arguments.length || typeof arguments[0] !== 'object') {
        return (function(length) {
          length = ToInt32(length);
          if (length < 0) throw RangeError('length is not a small enough positive integer.');
          Object.defineProperty(this, 'length', {value: length});
          Object.defineProperty(this, 'byteLength', {value: length * this.BYTES_PER_ELEMENT});
          Object.defineProperty(this, 'buffer', {value: new ArrayBuffer(this.byteLength)});
          Object.defineProperty(this, 'byteOffset', {value: 0});

         }).apply(this, arguments);
      }

      // %TypedArray% ( typedArray )
      if (arguments.length >= 1 &&
          Type(arguments[0]) === 'object' &&
          arguments[0] instanceof $TypedArray$) {
        return (function(typedArray){
          if (this.constructor !== typedArray.constructor) throw TypeError();

          var byteLength = typedArray.length * this.BYTES_PER_ELEMENT;
          Object.defineProperty(this, 'buffer', {value: new ArrayBuffer(byteLength)});
          Object.defineProperty(this, 'byteLength', {value: byteLength});
          Object.defineProperty(this, 'byteOffset', {value: 0});
          Object.defineProperty(this, 'length', {value: typedArray.length});

          for (var i = 0; i < this.length; i += 1)
            this._setter(i, typedArray._getter(i));

        }).apply(this, arguments);
      }

      // %TypedArray% ( array )
      if (arguments.length >= 1 &&
          Type(arguments[0]) === 'object' &&
          !(arguments[0] instanceof $TypedArray$) &&
          !(arguments[0] instanceof ArrayBuffer || Class(arguments[0]) === 'ArrayBuffer')) {
        return (function(array) {

          var byteLength = array.length * this.BYTES_PER_ELEMENT;
          Object.defineProperty(this, 'buffer', {value: new ArrayBuffer(byteLength)});
          Object.defineProperty(this, 'byteLength', {value: byteLength});
          Object.defineProperty(this, 'byteOffset', {value: 0});
          Object.defineProperty(this, 'length', {value: array.length});

          for (var i = 0; i < this.length; i += 1) {
            var s = array[i];
            this._setter(i, Number(s));
          }
        }).apply(this, arguments);
      }

      // %TypedArray% ( buffer, byteOffset=0, length=undefined )
      if (arguments.length >= 1 &&
          Type(arguments[0]) === 'object' &&
          (arguments[0] instanceof ArrayBuffer || Class(arguments[0]) === 'ArrayBuffer')) {
        return (function(buffer, byteOffset, length) {

          byteOffset = ToUint32(byteOffset);
          if (byteOffset > buffer.byteLength)
            throw RangeError('byteOffset out of range');

          // The given byteOffset must be a multiple of the element
          // size of the specific type, otherwise an exception is raised.
          if (byteOffset % this.BYTES_PER_ELEMENT)
            throw RangeError('buffer length minus the byteOffset is not a multiple of the element size.');

          if (length === undefined) {
            var byteLength = buffer.byteLength - byteOffset;
            if (byteLength % this.BYTES_PER_ELEMENT)
              throw RangeError('length of buffer minus byteOffset not a multiple of the element size');
            length = byteLength / this.BYTES_PER_ELEMENT;

          } else {
            length = ToUint32(length);
            byteLength = length * this.BYTES_PER_ELEMENT;
          }

          if ((byteOffset + byteLength) > buffer.byteLength)
            throw RangeError('byteOffset and length reference an area beyond the end of the buffer');

          Object.defineProperty(this, 'buffer', {value: buffer});
          Object.defineProperty(this, 'byteLength', {value: byteLength});
          Object.defineProperty(this, 'byteOffset', {value: byteOffset});
          Object.defineProperty(this, 'length', {value: length});

        }).apply(this, arguments);
      }

      // %TypedArray% ( all other argument combinations )
      throw TypeError();
    }

    // Properties of the %TypedArray Instrinsic Object

    // %TypedArray%.from ( source , mapfn=undefined, thisArg=undefined )
    Object.defineProperty($TypedArray$, 'from', {value: function(iterable) {
      return new this(iterable);
    }});

    // %TypedArray%.of ( ...items )
    Object.defineProperty($TypedArray$, 'of', {value: function(/*...items*/) {
      return new this(arguments);
    }});

    // %TypedArray%.prototype
    var $TypedArrayPrototype$ = {};
    $TypedArray$.prototype = $TypedArrayPrototype$;

    // WebIDL: getter type (unsigned long index);
    Object.defineProperty($TypedArray$.prototype, '_getter', {value: function(index) {
      if (arguments.length < 1) throw SyntaxError('Not enough arguments');

      index = ToUint32(index);
      if (index >= this.length)
        return undefined;

      var bytes = [], i, o;
      for (i = 0, o = this.byteOffset + index * this.BYTES_PER_ELEMENT;
           i < this.BYTES_PER_ELEMENT;
           i += 1, o += 1) {
        bytes.push(this.buffer._bytes[o]);
      }
      return this._unpack(bytes);
    }});

    // NONSTANDARD: convenience alias for getter: type get(unsigned long index);
    Object.defineProperty($TypedArray$.prototype, 'get', {value: $TypedArray$.prototype._getter});

    // WebIDL: setter void (unsigned long index, type value);
    Object.defineProperty($TypedArray$.prototype, '_setter', {value: function(index, value) {
      if (arguments.length < 2) throw SyntaxError('Not enough arguments');

      index = ToUint32(index);
      if (index >= this.length)
        return;

      var bytes = this._pack(value), i, o;
      for (i = 0, o = this.byteOffset + index * this.BYTES_PER_ELEMENT;
           i < this.BYTES_PER_ELEMENT;
           i += 1, o += 1) {
        this.buffer._bytes[o] = bytes[i];
      }
    }});

    // get %TypedArray%.prototype.buffer
    // get %TypedArray%.prototype.byteLength
    // get %TypedArray%.prototype.byteOffset
    // -- applied directly to the object in the constructor

    // %TypedArray%.prototype.constructor
    Object.defineProperty($TypedArray$.prototype, 'constructor', {value: $TypedArray$});

    // %TypedArray%.prototype.copyWithin (target, start, end = this.length )
    Object.defineProperty($TypedArray$.prototype, 'copyWithin', {value: function(target, start) {
      var end = arguments[2];

      var o = ToObject(this);
      var lenVal = o.length;
      var len = ToUint32(lenVal);
      len = max(len, 0);
      var relativeTarget = ToInt32(target);
      var to;
      if (relativeTarget < 0)
        to = max(len + relativeTarget, 0);
      else
        to = min(relativeTarget, len);
      var relativeStart = ToInt32(start);
      var from;
      if (relativeStart < 0)
        from = max(len + relativeStart, 0);
      else
        from = min(relativeStart, len);
      var relativeEnd;
      if (end === undefined)
        relativeEnd = len;
      else
        relativeEnd = ToInt32(end);
      var final0;
      if (relativeEnd < 0)
        final0 = max(len + relativeEnd, 0);
      else
        final0 = min(relativeEnd, len);
      var count = min(final0 - from, len - to);
      var direction;
      if (from < to && to < from + count) {
        direction = -1;
        from = from + count - 1;
        to = to + count - 1;
      } else {
        direction = 1;
      }
      while (count > 0) {
        o._setter(to, o._getter(from));
        from = from + direction;
        to = to + direction;
        count = count - 1;
      }
      return o;
    }});

    // %TypedArray%.prototype.entries ( )
    // -- defined in es6.js to shim browsers w/ native TypedArrays

    // %TypedArray%.prototype.every ( callbackfn, thisArg = undefined )
    Object.defineProperty($TypedArray$.prototype, 'every', {value: function(callbackfn) {
      if (this === undefined || this === null) throw TypeError();
      var t = Object(this);
      var len = ToUint32(t.length);
      if (!IsCallable(callbackfn)) throw TypeError();
      var thisArg = arguments[1];
      for (var i = 0; i < len; i++) {
        if (!callbackfn.call(thisArg, t._getter(i), i, t))
          return false;
      }
      return true;
    }});

    // %TypedArray%.prototype.fill (value, start = 0, end = this.length )
    Object.defineProperty($TypedArray$.prototype, 'fill', {value: function(value) {
      var start = arguments[1],
          end = arguments[2];

      var o = ToObject(this);
      var lenVal = o.length;
      var len = ToUint32(lenVal);
      len = max(len, 0);
      var relativeStart = ToInt32(start);
      var k;
      if (relativeStart < 0)
        k = max((len + relativeStart), 0);
      else
        k = min(relativeStart, len);
      var relativeEnd;
      if (end === undefined)
        relativeEnd = len;
      else
        relativeEnd = ToInt32(end);
      var final0;
      if (relativeEnd < 0)
        final0 = max((len + relativeEnd), 0);
      else
        final0 = min(relativeEnd, len);
      while (k < final0) {
        o._setter(k, value);
        k += 1;
      }
      return o;
    }});

    // %TypedArray%.prototype.filter ( callbackfn, thisArg = undefined )
    Object.defineProperty($TypedArray$.prototype, 'filter', {value: function(callbackfn) {
      if (this === undefined || this === null) throw TypeError();
      var t = Object(this);
      var len = ToUint32(t.length);
      if (!IsCallable(callbackfn)) throw TypeError();
      var res = [];
      var thisp = arguments[1];
      for (var i = 0; i < len; i++) {
        var val = t._getter(i); // in case fun mutates this
        if (callbackfn.call(thisp, val, i, t))
          res.push(val);
      }
      return new this.constructor(res);
    }});

    // %TypedArray%.prototype.find (predicate, thisArg = undefined)
    Object.defineProperty($TypedArray$.prototype, 'find', {value: function(predicate) {
      var o = ToObject(this);
      var lenValue = o.length;
      var len = ToUint32(lenValue);
      if (!IsCallable(predicate)) throw TypeError();
      var t = arguments.length > 1 ? arguments[1] : undefined;
      var k = 0;
      while (k < len) {
        var kValue = o._getter(k);
        var testResult = predicate.call(t, kValue, k, o);
        if (Boolean(testResult))
          return kValue;
        ++k;
      }
      return undefined;
    }});

    // %TypedArray%.prototype.findIndex ( predicate, thisArg = undefined )
    Object.defineProperty($TypedArray$.prototype, 'findIndex', {value: function(predicate) {
      var o = ToObject(this);
      var lenValue = o.length;
      var len = ToUint32(lenValue);
      if (!IsCallable(predicate)) throw TypeError();
      var t = arguments.length > 1 ? arguments[1] : undefined;
      var k = 0;
      while (k < len) {
        var kValue = o._getter(k);
        var testResult = predicate.call(t, kValue, k, o);
        if (Boolean(testResult))
          return k;
        ++k;
      }
      return -1;
    }});

    // %TypedArray%.prototype.forEach ( callbackfn, thisArg = undefined )
    Object.defineProperty($TypedArray$.prototype, 'forEach', {value: function(callbackfn) {
      if (this === undefined || this === null) throw TypeError();
      var t = Object(this);
      var len = ToUint32(t.length);
      if (!IsCallable(callbackfn)) throw TypeError();
      var thisp = arguments[1];
      for (var i = 0; i < len; i++)
        callbackfn.call(thisp, t._getter(i), i, t);
    }});

    // %TypedArray%.prototype.indexOf (searchElement, fromIndex = 0 )
    Object.defineProperty($TypedArray$.prototype, 'indexOf', {value: function(searchElement) {
      if (this === undefined || this === null) throw TypeError();
      var t = Object(this);
      var len = ToUint32(t.length);
      if (len === 0) return -1;
      var n = 0;
      if (arguments.length > 0) {
        n = Number(arguments[1]);
        if (n !== n) {
          n = 0;
        } else if (n !== 0 && n !== (1 / 0) && n !== -(1 / 0)) {
          n = (n > 0 || -1) * floor(abs(n));
        }
      }
      if (n >= len) return -1;
      var k = n >= 0 ? n : max(len - abs(n), 0);
      for (; k < len; k++) {
        if (t._getter(k) === searchElement) {
          return k;
        }
      }
      return -1;
    }});

    // %TypedArray%.prototype.join ( separator )
    Object.defineProperty($TypedArray$.prototype, 'join', {value: function(separator) {
      if (this === undefined || this === null) throw TypeError();
      var t = Object(this);
      var len = ToUint32(t.length);
      var tmp = Array(len);
      for (var i = 0; i < len; ++i)
        tmp[i] = t._getter(i);
      return tmp.join(separator === undefined ? ',' : separator); // Hack for IE7
    }});

    // %TypedArray%.prototype.keys ( )
    // -- defined in es6.js to shim browsers w/ native TypedArrays

    // %TypedArray%.prototype.lastIndexOf ( searchElement, fromIndex = this.length-1 )
    Object.defineProperty($TypedArray$.prototype, 'lastIndexOf', {value: function(searchElement) {
      if (this === undefined || this === null) throw TypeError();
      var t = Object(this);
      var len = ToUint32(t.length);
      if (len === 0) return -1;
      var n = len;
      if (arguments.length > 1) {
        n = Number(arguments[1]);
        if (n !== n) {
          n = 0;
        } else if (n !== 0 && n !== (1 / 0) && n !== -(1 / 0)) {
          n = (n > 0 || -1) * floor(abs(n));
        }
      }
      var k = n >= 0 ? min(n, len - 1) : len - abs(n);
      for (; k >= 0; k--) {
        if (t._getter(k) === searchElement)
          return k;
      }
      return -1;
    }});

    // get %TypedArray%.prototype.length
    // -- applied directly to the object in the constructor

    // %TypedArray%.prototype.map ( callbackfn, thisArg = undefined )
    Object.defineProperty($TypedArray$.prototype, 'map', {value: function(callbackfn) {
      if (this === undefined || this === null) throw TypeError();
      var t = Object(this);
      var len = ToUint32(t.length);
      if (!IsCallable(callbackfn)) throw TypeError();
      var res = []; res.length = len;
      var thisp = arguments[1];
      for (var i = 0; i < len; i++)
        res[i] = callbackfn.call(thisp, t._getter(i), i, t);
      return new this.constructor(res);
    }});

    // %TypedArray%.prototype.reduce ( callbackfn [, initialValue] )
    Object.defineProperty($TypedArray$.prototype, 'reduce', {value: function(callbackfn) {
      if (this === undefined || this === null) throw TypeError();
      var t = Object(this);
      var len = ToUint32(t.length);
      if (!IsCallable(callbackfn)) throw TypeError();
      // no value to return if no initial value and an empty array
      if (len === 0 && arguments.length === 1) throw TypeError();
      var k = 0;
      var accumulator;
      if (arguments.length >= 2) {
        accumulator = arguments[1];
      } else {
        accumulator = t._getter(k++);
      }
      while (k < len) {
        accumulator = callbackfn.call(undefined, accumulator, t._getter(k), k, t);
        k++;
      }
      return accumulator;
    }});

    // %TypedArray%.prototype.reduceRight ( callbackfn [, initialValue] )
    Object.defineProperty($TypedArray$.prototype, 'reduceRight', {value: function(callbackfn) {
      if (this === undefined || this === null) throw TypeError();
      var t = Object(this);
      var len = ToUint32(t.length);
      if (!IsCallable(callbackfn)) throw TypeError();
      // no value to return if no initial value, empty array
      if (len === 0 && arguments.length === 1) throw TypeError();
      var k = len - 1;
      var accumulator;
      if (arguments.length >= 2) {
        accumulator = arguments[1];
      } else {
        accumulator = t._getter(k--);
      }
      while (k >= 0) {
        accumulator = callbackfn.call(undefined, accumulator, t._getter(k), k, t);
        k--;
      }
      return accumulator;
    }});

    // %TypedArray%.prototype.reverse ( )
    Object.defineProperty($TypedArray$.prototype, 'reverse', {value: function() {
      if (this === undefined || this === null) throw TypeError();
      var t = Object(this);
      var len = ToUint32(t.length);
      var half = floor(len / 2);
      for (var i = 0, j = len - 1; i < half; ++i, --j) {
        var tmp = t._getter(i);
        t._setter(i, t._getter(j));
        t._setter(j, tmp);
      }
      return t;
    }});

    // %TypedArray%.prototype.set(array, offset = 0 )
    // %TypedArray%.prototype.set(typedArray, offset = 0 )
    // WebIDL: void set(TypedArray array, optional unsigned long offset);
    // WebIDL: void set(sequence<type> array, optional unsigned long offset);
    Object.defineProperty($TypedArray$.prototype, 'set', {value: function(index, value) {
      if (arguments.length < 1) throw SyntaxError('Not enough arguments');
      var array, sequence, offset, len,
          i, s, d,
          byteOffset, byteLength, tmp;

      if (typeof arguments[0] === 'object' && arguments[0].constructor === this.constructor) {
        // void set(TypedArray array, optional unsigned long offset);
        array = arguments[0];
        offset = ToUint32(arguments[1]);

        if (offset + array.length > this.length) {
          throw RangeError('Offset plus length of array is out of range');
        }

        byteOffset = this.byteOffset + offset * this.BYTES_PER_ELEMENT;
        byteLength = array.length * this.BYTES_PER_ELEMENT;

        if (array.buffer === this.buffer) {
          tmp = [];
          for (i = 0, s = array.byteOffset; i < byteLength; i += 1, s += 1) {
            tmp[i] = array.buffer._bytes[s];
          }
          for (i = 0, d = byteOffset; i < byteLength; i += 1, d += 1) {
            this.buffer._bytes[d] = tmp[i];
          }
        } else {
          for (i = 0, s = array.byteOffset, d = byteOffset;
               i < byteLength; i += 1, s += 1, d += 1) {
            this.buffer._bytes[d] = array.buffer._bytes[s];
          }
        }
      } else if (typeof arguments[0] === 'object' && typeof arguments[0].length !== 'undefined') {
        // void set(sequence<type> array, optional unsigned long offset);
        sequence = arguments[0];
        len = ToUint32(sequence.length);
        offset = ToUint32(arguments[1]);

        if (offset + len > this.length) {
          throw RangeError('Offset plus length of array is out of range');
        }

        for (i = 0; i < len; i += 1) {
          s = sequence[i];
          this._setter(offset + i, Number(s));
        }
      } else {
        throw TypeError('Unexpected argument type(s)');
      }
    }});

    // %TypedArray%.prototype.slice ( start, end )
    Object.defineProperty($TypedArray$.prototype, 'slice', {value: function(start, end) {
      var o = ToObject(this);
      var lenVal = o.length;
      var len = ToUint32(lenVal);
      var relativeStart = ToInt32(start);
      var k = (relativeStart < 0) ? max(len + relativeStart, 0) : min(relativeStart, len);
      var relativeEnd = (end === undefined) ? len : ToInt32(end);
      var final0 = (relativeEnd < 0) ? max(len + relativeEnd, 0) : min(relativeEnd, len);
      var count = final0 - k;
      var c = o.constructor;
      var a = new c(count);
      var n = 0;
      while (k < final0) {
        var kValue = o._getter(k);
        a._setter(n, kValue);
        ++k;
        ++n;
      }
      return a;
    }});

    // %TypedArray%.prototype.some ( callbackfn, thisArg = undefined )
    Object.defineProperty($TypedArray$.prototype, 'some', {value: function(callbackfn) {
      if (this === undefined || this === null) throw TypeError();
      var t = Object(this);
      var len = ToUint32(t.length);
      if (!IsCallable(callbackfn)) throw TypeError();
      var thisp = arguments[1];
      for (var i = 0; i < len; i++) {
        if (callbackfn.call(thisp, t._getter(i), i, t)) {
          return true;
        }
      }
      return false;
    }});

    // %TypedArray%.prototype.sort ( comparefn )
    Object.defineProperty($TypedArray$.prototype, 'sort', {value: function(comparefn) {
      if (this === undefined || this === null) throw TypeError();
      var t = Object(this);
      var len = ToUint32(t.length);
      var tmp = Array(len);
      for (var i = 0; i < len; ++i)
        tmp[i] = t._getter(i);
      if (comparefn) tmp.sort(comparefn); else tmp.sort(); // Hack for IE8/9
      for (i = 0; i < len; ++i)
        t._setter(i, tmp[i]);
      return t;
    }});

    // %TypedArray%.prototype.subarray(begin = 0, end = this.length )
    // WebIDL: TypedArray subarray(long begin, optional long end);
    Object.defineProperty($TypedArray$.prototype, 'subarray', {value: function(start, end) {
      function clamp(v, min, max) { return v < min ? min : v > max ? max : v; }

      start = ToInt32(start);
      end = ToInt32(end);

      if (arguments.length < 1) { start = 0; }
      if (arguments.length < 2) { end = this.length; }

      if (start < 0) { start = this.length + start; }
      if (end < 0) { end = this.length + end; }

      start = clamp(start, 0, this.length);
      end = clamp(end, 0, this.length);

      var len = end - start;
      if (len < 0) {
        len = 0;
      }

      return new this.constructor(
        this.buffer, this.byteOffset + start * this.BYTES_PER_ELEMENT, len);
    }});

    // %TypedArray%.prototype.toLocaleString ( )
    // %TypedArray%.prototype.toString ( )
    // %TypedArray%.prototype.values ( )
    // %TypedArray%.prototype [ @@iterator ] ( )
    // get %TypedArray%.prototype [ @@toStringTag ]
    // -- defined in es6.js to shim browsers w/ native TypedArrays

    function makeTypedArray(elementSize, pack, unpack) {
      // Each TypedArray type requires a distinct constructor instance with
      // identical logic, which this produces.
      var TypedArray = function() {
        Object.defineProperty(this, 'constructor', {value: TypedArray});
        $TypedArray$.apply(this, arguments);
        makeArrayAccessors(this);
      };
      if ('__proto__' in TypedArray) {
        TypedArray.__proto__ = $TypedArray$;
      } else {
        TypedArray.from = $TypedArray$.from;
        TypedArray.of = $TypedArray$.of;
      }

      TypedArray.BYTES_PER_ELEMENT = elementSize;

      var TypedArrayPrototype = function() {};
      TypedArrayPrototype.prototype = $TypedArrayPrototype$;

      TypedArray.prototype = new TypedArrayPrototype();

      Object.defineProperty(TypedArray.prototype, 'BYTES_PER_ELEMENT', {value: elementSize});
      Object.defineProperty(TypedArray.prototype, '_pack', {value: pack});
      Object.defineProperty(TypedArray.prototype, '_unpack', {value: unpack});

      return TypedArray;
    }

    var Int8Array = makeTypedArray(1, packI8, unpackI8);
    var Uint8Array = makeTypedArray(1, packU8, unpackU8);
    var Uint8ClampedArray = makeTypedArray(1, packU8Clamped, unpackU8);
    var Int16Array = makeTypedArray(2, packI16, unpackI16);
    var Uint16Array = makeTypedArray(2, packU16, unpackU16);
    var Int32Array = makeTypedArray(4, packI32, unpackI32);
    var Uint32Array = makeTypedArray(4, packU32, unpackU32);
    var Float32Array = makeTypedArray(4, packF32, unpackF32);
    var Float64Array = makeTypedArray(8, packF64, unpackF64);

    global.Int8Array = global.Int8Array || Int8Array;
    global.Uint8Array = global.Uint8Array || Uint8Array;
    global.Uint8ClampedArray = global.Uint8ClampedArray || Uint8ClampedArray;
    global.Int16Array = global.Int16Array || Int16Array;
    global.Uint16Array = global.Uint16Array || Uint16Array;
    global.Int32Array = global.Int32Array || Int32Array;
    global.Uint32Array = global.Uint32Array || Uint32Array;
    global.Float32Array = global.Float32Array || Float32Array;
    global.Float64Array = global.Float64Array || Float64Array;
  }());

  //
  // 6 The DataView View Type
  //

  (function() {
    function r(array, index) {
      return IsCallable(array.get) ? array.get(index) : array[index];
    }

    var IS_BIG_ENDIAN = (function() {
      var u16array = new Uint16Array([0x1234]),
          u8array = new Uint8Array(u16array.buffer);
      return r(u8array, 0) === 0x12;
    }());

    // DataView(buffer, byteOffset=0, byteLength=undefined)
    // WebIDL: Constructor(ArrayBuffer buffer,
    //                     optional unsigned long byteOffset,
    //                     optional unsigned long byteLength)
    function DataView(buffer, byteOffset, byteLength) {
      if (!(buffer instanceof ArrayBuffer || Class(buffer) === 'ArrayBuffer')) throw TypeError();

      byteOffset = ToUint32(byteOffset);
      if (byteOffset > buffer.byteLength)
        throw RangeError('byteOffset out of range');

      if (byteLength === undefined)
        byteLength = buffer.byteLength - byteOffset;
      else
        byteLength = ToUint32(byteLength);

      if ((byteOffset + byteLength) > buffer.byteLength)
        throw RangeError('byteOffset and length reference an area beyond the end of the buffer');

      Object.defineProperty(this, 'buffer', {value: buffer});
      Object.defineProperty(this, 'byteLength', {value: byteLength});
      Object.defineProperty(this, 'byteOffset', {value: byteOffset});
    };

    // get DataView.prototype.buffer
    // get DataView.prototype.byteLength
    // get DataView.prototype.byteOffset
    // -- applied directly to instances by the constructor

    function makeGetter(arrayType) {
      return function GetViewValue(byteOffset, littleEndian) {
        byteOffset = ToUint32(byteOffset);

        if (byteOffset + arrayType.BYTES_PER_ELEMENT > this.byteLength)
          throw RangeError('Array index out of range');

        byteOffset += this.byteOffset;

        var uint8Array = new Uint8Array(this.buffer, byteOffset, arrayType.BYTES_PER_ELEMENT),
            bytes = [];
        for (var i = 0; i < arrayType.BYTES_PER_ELEMENT; i += 1)
          bytes.push(r(uint8Array, i));

        if (Boolean(littleEndian) === Boolean(IS_BIG_ENDIAN))
          bytes.reverse();

        return r(new arrayType(new Uint8Array(bytes).buffer), 0);
      };
    }

    Object.defineProperty(DataView.prototype, 'getUint8', {value: makeGetter(Uint8Array)});
    Object.defineProperty(DataView.prototype, 'getInt8', {value: makeGetter(Int8Array)});
    Object.defineProperty(DataView.prototype, 'getUint16', {value: makeGetter(Uint16Array)});
    Object.defineProperty(DataView.prototype, 'getInt16', {value: makeGetter(Int16Array)});
    Object.defineProperty(DataView.prototype, 'getUint32', {value: makeGetter(Uint32Array)});
    Object.defineProperty(DataView.prototype, 'getInt32', {value: makeGetter(Int32Array)});
    Object.defineProperty(DataView.prototype, 'getFloat32', {value: makeGetter(Float32Array)});
    Object.defineProperty(DataView.prototype, 'getFloat64', {value: makeGetter(Float64Array)});

    function makeSetter(arrayType) {
      return function SetViewValue(byteOffset, value, littleEndian) {
        byteOffset = ToUint32(byteOffset);
        if (byteOffset + arrayType.BYTES_PER_ELEMENT > this.byteLength)
          throw RangeError('Array index out of range');

        // Get bytes
        var typeArray = new arrayType([value]),
            byteArray = new Uint8Array(typeArray.buffer),
            bytes = [], i, byteView;

        for (i = 0; i < arrayType.BYTES_PER_ELEMENT; i += 1)
          bytes.push(r(byteArray, i));

        // Flip if necessary
        if (Boolean(littleEndian) === Boolean(IS_BIG_ENDIAN))
          bytes.reverse();

        // Write them
        byteView = new Uint8Array(this.buffer, byteOffset, arrayType.BYTES_PER_ELEMENT);
        byteView.set(bytes);
      };
    }

    Object.defineProperty(DataView.prototype, 'setUint8', {value: makeSetter(Uint8Array)});
    Object.defineProperty(DataView.prototype, 'setInt8', {value: makeSetter(Int8Array)});
    Object.defineProperty(DataView.prototype, 'setUint16', {value: makeSetter(Uint16Array)});
    Object.defineProperty(DataView.prototype, 'setInt16', {value: makeSetter(Int16Array)});
    Object.defineProperty(DataView.prototype, 'setUint32', {value: makeSetter(Uint32Array)});
    Object.defineProperty(DataView.prototype, 'setInt32', {value: makeSetter(Int32Array)});
    Object.defineProperty(DataView.prototype, 'setFloat32', {value: makeSetter(Float32Array)});
    Object.defineProperty(DataView.prototype, 'setFloat64', {value: makeSetter(Float64Array)});

    global.DataView = global.DataView || DataView;

  }());

}(h$getGlobal(this)));
(function (global, undefined) {
    "use strict";

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var setImmediate;

    function addFromSetImmediateArguments(args) {
        tasksByHandle[nextHandle] = partiallyApplied.apply(undefined, args);
        return nextHandle++;
    }

    // This function accepts the same arguments as setImmediate, but
    // returns a function that requires no arguments.
    function partiallyApplied(handler) {
        var args = [].slice.call(arguments, 1);
        return function() {
            if (typeof handler === "function") {
                handler.apply(undefined, args);
            } else {
                (new Function("" + handler))();
            }
        };
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(partiallyApplied(runIfPresent, handle), 0);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    task();
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }
    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function() {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function(event) {
            if (event.source === global &&
                typeof event.data === "string" &&
                event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        setImmediate = function() {
            var handle = addFromSetImmediateArguments(arguments);
            global.postMessage(messagePrefix + handle, "*");
            return handle;
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        setImmediate = function() {
            var handle = addFromSetImmediateArguments(arguments);
            channel.port2.postMessage(handle);
            return handle;
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        setImmediate = function() {
            var handle = addFromSetImmediateArguments(arguments);
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
            return handle;
        };
    }

    function installSetTimeoutImplementation() {
        // jsshell doesn't even have setTimeout




          setImmediate = function() {
            var handle = addFromSetImmediateArguments(arguments);
            setTimeout(partiallyApplied(runIfPresent, handle), 0);
            return handle;
        };
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    // Don't get fooled by e.g. browserify environments.







       if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();

    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();

    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6–8
        installReadyStateChangeImplementation();

    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
}(h$getGlobal(this)));
// Copyright 2009 The Closure Library Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Defines a Long class for representing a 64-bit two's-complement
 * integer value, which faithfully simulates the behavior of a Java "long". This
 * implementation is derived from LongLib in GWT.
 *
 */

goog.provide('goog.math.Long');



/**
 * Constructs a 64-bit two's-complement integer, given its low and high 32-bit
 * values as *signed* integers.  See the from* functions below for more
 * convenient ways of constructing Longs.
 *
 * The internal representation of a long is the two given signed, 32-bit values.
 * We use 32-bit pieces because these are the size of integers on which
 * Javascript performs bit-operations.  For operations like addition and
 * multiplication, we split each number into 16-bit pieces, which can easily be
 * multiplied within Javascript's floating-point representation without overflow
 * or change in sign.
 *
 * In the algorithms below, we frequently reduce the negative case to the
 * positive case by negating the input(s) and then post-processing the result.
 * Note that we must ALWAYS check specially whether those values are MIN_VALUE
 * (-2^63) because -MIN_VALUE == MIN_VALUE (since 2^63 cannot be represented as
 * a positive number, it overflows back into a negative).  Not handling this
 * case would often result in infinite recursion.
 *
 * @param {number} low  The low (signed) 32 bits of the long.
 * @param {number} high  The high (signed) 32 bits of the long.
 * @struct
 * @constructor
 * @final
 */
goog.math.Long = function(low, high) {
  /**
   * @type {number}
   * @private
   */
  this.low_ = low | 0; // force into 32 signed bits.

  /**
   * @type {number}
   * @private
   */
  this.high_ = high | 0; // force into 32 signed bits.
};


// NOTE: Common constant values ZERO, ONE, NEG_ONE, etc. are defined below the
// from* methods on which they depend.


/**
 * A cache of the Long representations of small integer values.
 * @type {!Object}
 * @private
 */
goog.math.Long.IntCache_ = {};


/**
 * Returns a Long representing the given (32-bit) integer value.
 * @param {number} value The 32-bit integer in question.
 * @return {!goog.math.Long} The corresponding Long value.
 */
goog.math.Long.fromInt = function(value) {
  if (-128 <= value && value < 128) {
    var cachedObj = goog.math.Long.IntCache_[value];
    if (cachedObj) {
      return cachedObj;
    }
  }

  var obj = new goog.math.Long(value | 0, value < 0 ? -1 : 0);
  if (-128 <= value && value < 128) {
    goog.math.Long.IntCache_[value] = obj;
  }
  return obj;
};


/**
 * Returns a Long representing the given value, provided that it is a finite
 * number.  Otherwise, zero is returned.
 * @param {number} value The number in question.
 * @return {!goog.math.Long} The corresponding Long value.
 */
goog.math.Long.fromNumber = function(value) {
  if (isNaN(value) || !isFinite(value)) {
    return goog.math.Long.ZERO;
  } else if (value <= -goog.math.Long.TWO_PWR_63_DBL_) {
    return goog.math.Long.MIN_VALUE;
  } else if (value + 1 >= goog.math.Long.TWO_PWR_63_DBL_) {
    return goog.math.Long.MAX_VALUE;
  } else if (value < 0) {
    return goog.math.Long.fromNumber(-value).negate();
  } else {
    return new goog.math.Long(
        (value % goog.math.Long.TWO_PWR_32_DBL_) | 0,
        (value / goog.math.Long.TWO_PWR_32_DBL_) | 0);
  }
};


/**
 * Returns a Long representing the 64-bit integer that comes by concatenating
 * the given high and low bits.  Each is assumed to use 32 bits.
 * @param {number} lowBits The low 32-bits.
 * @param {number} highBits The high 32-bits.
 * @return {!goog.math.Long} The corresponding Long value.
 */
goog.math.Long.fromBits = function(lowBits, highBits) {
  return new goog.math.Long(lowBits, highBits);
};


/**
 * Returns a Long representation of the given string, written using the given
 * radix.
 * @param {string} str The textual representation of the Long.
 * @param {number=} opt_radix The radix in which the text is written.
 * @return {!goog.math.Long} The corresponding Long value.
 */
goog.math.Long.fromString = function(str, opt_radix) {
  if (str.length == 0) {
    throw Error('number format error: empty string');
  }

  var radix = opt_radix || 10;
  if (radix < 2 || 36 < radix) {
    throw Error('radix out of range: ' + radix);
  }

  if (str.charAt(0) == '-') {
    return goog.math.Long.fromString(str.substring(1), radix).negate();
  } else if (str.indexOf('-') >= 0) {
    throw Error('number format error: interior "-" character: ' + str);
  }

  // Do several (8) digits each time through the loop, so as to
  // minimize the calls to the very expensive emulated div.
  var radixToPower = goog.math.Long.fromNumber(Math.pow(radix, 8));

  var result = goog.math.Long.ZERO;
  for (var i = 0; i < str.length; i += 8) {
    var size = Math.min(8, str.length - i);
    var value = parseInt(str.substring(i, i + size), radix);
    if (size < 8) {
      var power = goog.math.Long.fromNumber(Math.pow(radix, size));
      result = result.multiply(power).add(goog.math.Long.fromNumber(value));
    } else {
      result = result.multiply(radixToPower);
      result = result.add(goog.math.Long.fromNumber(value));
    }
  }
  return result;
};


// NOTE: the compiler should inline these constant values below and then remove
// these variables, so there should be no runtime penalty for these.


/**
 * Number used repeated below in calculations.  This must appear before the
 * first call to any from* function below.
 * @type {number}
 * @private
 */
goog.math.Long.TWO_PWR_16_DBL_ = 1 << 16;


/**
 * @type {number}
 * @private
 */
goog.math.Long.TWO_PWR_24_DBL_ = 1 << 24;


/**
 * @type {number}
 * @private
 */
goog.math.Long.TWO_PWR_32_DBL_ =
    goog.math.Long.TWO_PWR_16_DBL_ * goog.math.Long.TWO_PWR_16_DBL_;


/**
 * @type {number}
 * @private
 */
goog.math.Long.TWO_PWR_31_DBL_ =
    goog.math.Long.TWO_PWR_32_DBL_ / 2;


/**
 * @type {number}
 * @private
 */
goog.math.Long.TWO_PWR_48_DBL_ =
    goog.math.Long.TWO_PWR_32_DBL_ * goog.math.Long.TWO_PWR_16_DBL_;


/**
 * @type {number}
 * @private
 */
goog.math.Long.TWO_PWR_64_DBL_ =
    goog.math.Long.TWO_PWR_32_DBL_ * goog.math.Long.TWO_PWR_32_DBL_;


/**
 * @type {number}
 * @private
 */
goog.math.Long.TWO_PWR_63_DBL_ =
    goog.math.Long.TWO_PWR_64_DBL_ / 2;


/** @type {!goog.math.Long} */
goog.math.Long.ZERO = goog.math.Long.fromInt(0);


/** @type {!goog.math.Long} */
goog.math.Long.ONE = goog.math.Long.fromInt(1);


/** @type {!goog.math.Long} */
goog.math.Long.NEG_ONE = goog.math.Long.fromInt(-1);


/** @type {!goog.math.Long} */
goog.math.Long.MAX_VALUE =
    goog.math.Long.fromBits(0xFFFFFFFF | 0, 0x7FFFFFFF | 0);


/** @type {!goog.math.Long} */
goog.math.Long.MIN_VALUE = goog.math.Long.fromBits(0, 0x80000000 | 0);


/**
 * @type {!goog.math.Long}
 * @private
 */
goog.math.Long.TWO_PWR_24_ = goog.math.Long.fromInt(1 << 24);


/** @return {number} The value, assuming it is a 32-bit integer. */
goog.math.Long.prototype.toInt = function() {
  return this.low_;
};


/** @return {number} The closest floating-point representation to this value. */
goog.math.Long.prototype.toNumber = function() {
  return this.high_ * goog.math.Long.TWO_PWR_32_DBL_ +
         this.getLowBitsUnsigned();
};


/**
 * @param {number=} opt_radix The radix in which the text should be written.
 * @return {string} The textual representation of this value.
 * @override
 */
goog.math.Long.prototype.toString = function(opt_radix) {
  var radix = opt_radix || 10;
  if (radix < 2 || 36 < radix) {
    throw Error('radix out of range: ' + radix);
  }

  if (this.isZero()) {
    return '0';
  }

  if (this.isNegative()) {
    if (this.equals(goog.math.Long.MIN_VALUE)) {
      // We need to change the Long value before it can be negated, so we remove
      // the bottom-most digit in this base and then recurse to do the rest.
      var radixLong = goog.math.Long.fromNumber(radix);
      var div = this.div(radixLong);
      var rem = div.multiply(radixLong).subtract(this);
      return div.toString(radix) + rem.toInt().toString(radix);
    } else {
      return '-' + this.negate().toString(radix);
    }
  }

  // Do several (6) digits each time through the loop, so as to
  // minimize the calls to the very expensive emulated div.
  var radixToPower = goog.math.Long.fromNumber(Math.pow(radix, 6));

  var rem = this;
  var result = '';
  while (true) {
    var remDiv = rem.div(radixToPower);
    var intval = rem.subtract(remDiv.multiply(radixToPower)).toInt();
    var digits = intval.toString(radix);

    rem = remDiv;
    if (rem.isZero()) {
      return digits + result;
    } else {
      while (digits.length < 6) {
        digits = '0' + digits;
      }
      result = '' + digits + result;
    }
  }
};


/** @return {number} The high 32-bits as a signed value. */
goog.math.Long.prototype.getHighBits = function() {
  return this.high_;
};


/** @return {number} The low 32-bits as a signed value. */
goog.math.Long.prototype.getLowBits = function() {
  return this.low_;
};


/** @return {number} The low 32-bits as an unsigned value. */
goog.math.Long.prototype.getLowBitsUnsigned = function() {
  return (this.low_ >= 0) ?
      this.low_ : goog.math.Long.TWO_PWR_32_DBL_ + this.low_;
};


/**
 * @return {number} Returns the number of bits needed to represent the absolute
 *     value of this Long.
 */
goog.math.Long.prototype.getNumBitsAbs = function() {
  if (this.isNegative()) {
    if (this.equals(goog.math.Long.MIN_VALUE)) {
      return 64;
    } else {
      return this.negate().getNumBitsAbs();
    }
  } else {
    var val = this.high_ != 0 ? this.high_ : this.low_;
    for (var bit = 31; bit > 0; bit--) {
      if ((val & (1 << bit)) != 0) {
        break;
      }
    }
    return this.high_ != 0 ? bit + 33 : bit + 1;
  }
};


/** @return {boolean} Whether this value is zero. */
goog.math.Long.prototype.isZero = function() {
  return this.high_ == 0 && this.low_ == 0;
};


/** @return {boolean} Whether this value is negative. */
goog.math.Long.prototype.isNegative = function() {
  return this.high_ < 0;
};


/** @return {boolean} Whether this value is odd. */
goog.math.Long.prototype.isOdd = function() {
  return (this.low_ & 1) == 1;
};


/**
 * @param {goog.math.Long} other Long to compare against.
 * @return {boolean} Whether this Long equals the other.
 */
goog.math.Long.prototype.equals = function(other) {
  return (this.high_ == other.high_) && (this.low_ == other.low_);
};


/**
 * @param {goog.math.Long} other Long to compare against.
 * @return {boolean} Whether this Long does not equal the other.
 */
goog.math.Long.prototype.notEquals = function(other) {
  return (this.high_ != other.high_) || (this.low_ != other.low_);
};


/**
 * @param {goog.math.Long} other Long to compare against.
 * @return {boolean} Whether this Long is less than the other.
 */
goog.math.Long.prototype.lessThan = function(other) {
  return this.compare(other) < 0;
};


/**
 * @param {goog.math.Long} other Long to compare against.
 * @return {boolean} Whether this Long is less than or equal to the other.
 */
goog.math.Long.prototype.lessThanOrEqual = function(other) {
  return this.compare(other) <= 0;
};


/**
 * @param {goog.math.Long} other Long to compare against.
 * @return {boolean} Whether this Long is greater than the other.
 */
goog.math.Long.prototype.greaterThan = function(other) {
  return this.compare(other) > 0;
};


/**
 * @param {goog.math.Long} other Long to compare against.
 * @return {boolean} Whether this Long is greater than or equal to the other.
 */
goog.math.Long.prototype.greaterThanOrEqual = function(other) {
  return this.compare(other) >= 0;
};


/**
 * Compares this Long with the given one.
 * @param {goog.math.Long} other Long to compare against.
 * @return {number} 0 if they are the same, 1 if the this is greater, and -1
 *     if the given one is greater.
 */
goog.math.Long.prototype.compare = function(other) {
  if (this.equals(other)) {
    return 0;
  }

  var thisNeg = this.isNegative();
  var otherNeg = other.isNegative();
  if (thisNeg && !otherNeg) {
    return -1;
  }
  if (!thisNeg && otherNeg) {
    return 1;
  }

  // at this point, the signs are the same, so subtraction will not overflow
  if (this.subtract(other).isNegative()) {
    return -1;
  } else {
    return 1;
  }
};


/** @return {!goog.math.Long} The negation of this value. */
goog.math.Long.prototype.negate = function() {
  if (this.equals(goog.math.Long.MIN_VALUE)) {
    return goog.math.Long.MIN_VALUE;
  } else {
    return this.not().add(goog.math.Long.ONE);
  }
};


/**
 * Returns the sum of this and the given Long.
 * @param {goog.math.Long} other Long to add to this one.
 * @return {!goog.math.Long} The sum of this and the given Long.
 */
goog.math.Long.prototype.add = function(other) {
  // Divide each number into 4 chunks of 16 bits, and then sum the chunks.

  var a48 = this.high_ >>> 16;
  var a32 = this.high_ & 0xFFFF;
  var a16 = this.low_ >>> 16;
  var a00 = this.low_ & 0xFFFF;

  var b48 = other.high_ >>> 16;
  var b32 = other.high_ & 0xFFFF;
  var b16 = other.low_ >>> 16;
  var b00 = other.low_ & 0xFFFF;

  var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
  c00 += a00 + b00;
  c16 += c00 >>> 16;
  c00 &= 0xFFFF;
  c16 += a16 + b16;
  c32 += c16 >>> 16;
  c16 &= 0xFFFF;
  c32 += a32 + b32;
  c48 += c32 >>> 16;
  c32 &= 0xFFFF;
  c48 += a48 + b48;
  c48 &= 0xFFFF;
  return goog.math.Long.fromBits((c16 << 16) | c00, (c48 << 16) | c32);
};


/**
 * Returns the difference of this and the given Long.
 * @param {goog.math.Long} other Long to subtract from this.
 * @return {!goog.math.Long} The difference of this and the given Long.
 */
goog.math.Long.prototype.subtract = function(other) {
  return this.add(other.negate());
};


/**
 * Returns the product of this and the given long.
 * @param {goog.math.Long} other Long to multiply with this.
 * @return {!goog.math.Long} The product of this and the other.
 */
goog.math.Long.prototype.multiply = function(other) {
  if (this.isZero()) {
    return goog.math.Long.ZERO;
  } else if (other.isZero()) {
    return goog.math.Long.ZERO;
  }

  if (this.equals(goog.math.Long.MIN_VALUE)) {
    return other.isOdd() ? goog.math.Long.MIN_VALUE : goog.math.Long.ZERO;
  } else if (other.equals(goog.math.Long.MIN_VALUE)) {
    return this.isOdd() ? goog.math.Long.MIN_VALUE : goog.math.Long.ZERO;
  }

  if (this.isNegative()) {
    if (other.isNegative()) {
      return this.negate().multiply(other.negate());
    } else {
      return this.negate().multiply(other).negate();
    }
  } else if (other.isNegative()) {
    return this.multiply(other.negate()).negate();
  }

  // If both longs are small, use float multiplication
  if (this.lessThan(goog.math.Long.TWO_PWR_24_) &&
      other.lessThan(goog.math.Long.TWO_PWR_24_)) {
    return goog.math.Long.fromNumber(this.toNumber() * other.toNumber());
  }

  // Divide each long into 4 chunks of 16 bits, and then add up 4x4 products.
  // We can skip products that would overflow.

  var a48 = this.high_ >>> 16;
  var a32 = this.high_ & 0xFFFF;
  var a16 = this.low_ >>> 16;
  var a00 = this.low_ & 0xFFFF;

  var b48 = other.high_ >>> 16;
  var b32 = other.high_ & 0xFFFF;
  var b16 = other.low_ >>> 16;
  var b00 = other.low_ & 0xFFFF;

  var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
  c00 += a00 * b00;
  c16 += c00 >>> 16;
  c00 &= 0xFFFF;
  c16 += a16 * b00;
  c32 += c16 >>> 16;
  c16 &= 0xFFFF;
  c16 += a00 * b16;
  c32 += c16 >>> 16;
  c16 &= 0xFFFF;
  c32 += a32 * b00;
  c48 += c32 >>> 16;
  c32 &= 0xFFFF;
  c32 += a16 * b16;
  c48 += c32 >>> 16;
  c32 &= 0xFFFF;
  c32 += a00 * b32;
  c48 += c32 >>> 16;
  c32 &= 0xFFFF;
  c48 += a48 * b00 + a32 * b16 + a16 * b32 + a00 * b48;
  c48 &= 0xFFFF;
  return goog.math.Long.fromBits((c16 << 16) | c00, (c48 << 16) | c32);
};


/**
 * Returns this Long divided by the given one.
 * @param {goog.math.Long} other Long by which to divide.
 * @return {!goog.math.Long} This Long divided by the given one.
 */
goog.math.Long.prototype.div = function(other) {
  if (other.isZero()) {
    throw Error('division by zero');
  } else if (this.isZero()) {
    return goog.math.Long.ZERO;
  }

  if (this.equals(goog.math.Long.MIN_VALUE)) {
    if (other.equals(goog.math.Long.ONE) ||
        other.equals(goog.math.Long.NEG_ONE)) {
      return goog.math.Long.MIN_VALUE; // recall that -MIN_VALUE == MIN_VALUE
    } else if (other.equals(goog.math.Long.MIN_VALUE)) {
      return goog.math.Long.ONE;
    } else {
      // At this point, we have |other| >= 2, so |this/other| < |MIN_VALUE|.
      var halfThis = this.shiftRight(1);
      var approx = halfThis.div(other).shiftLeft(1);
      if (approx.equals(goog.math.Long.ZERO)) {
        return other.isNegative() ? goog.math.Long.ONE : goog.math.Long.NEG_ONE;
      } else {
        var rem = this.subtract(other.multiply(approx));
        var result = approx.add(rem.div(other));
        return result;
      }
    }
  } else if (other.equals(goog.math.Long.MIN_VALUE)) {
    return goog.math.Long.ZERO;
  }

  if (this.isNegative()) {
    if (other.isNegative()) {
      return this.negate().div(other.negate());
    } else {
      return this.negate().div(other).negate();
    }
  } else if (other.isNegative()) {
    return this.div(other.negate()).negate();
  }

  // Repeat the following until the remainder is less than other:  find a
  // floating-point that approximates remainder / other *from below*, add this
  // into the result, and subtract it from the remainder.  It is critical that
  // the approximate value is less than or equal to the real value so that the
  // remainder never becomes negative.
  var res = goog.math.Long.ZERO;
  var rem = this;
  while (rem.greaterThanOrEqual(other)) {
    // Approximate the result of division. This may be a little greater or
    // smaller than the actual value.
    var approx = Math.max(1, Math.floor(rem.toNumber() / other.toNumber()));

    // We will tweak the approximate result by changing it in the 48-th digit or
    // the smallest non-fractional digit, whichever is larger.
    var log2 = Math.ceil(Math.log(approx) / Math.LN2);
    var delta = (log2 <= 48) ? 1 : Math.pow(2, log2 - 48);

    // Decrease the approximation until it is smaller than the remainder.  Note
    // that if it is too large, the product overflows and is negative.
    var approxRes = goog.math.Long.fromNumber(approx);
    var approxRem = approxRes.multiply(other);
    while (approxRem.isNegative() || approxRem.greaterThan(rem)) {
      approx -= delta;
      approxRes = goog.math.Long.fromNumber(approx);
      approxRem = approxRes.multiply(other);
    }

    // We know the answer can't be zero... and actually, zero would cause
    // infinite recursion since we would make no progress.
    if (approxRes.isZero()) {
      approxRes = goog.math.Long.ONE;
    }

    res = res.add(approxRes);
    rem = rem.subtract(approxRem);
  }
  return res;
};


/**
 * Returns this Long modulo the given one.
 * @param {goog.math.Long} other Long by which to mod.
 * @return {!goog.math.Long} This Long modulo the given one.
 */
goog.math.Long.prototype.modulo = function(other) {
  return this.subtract(this.div(other).multiply(other));
};


/** @return {!goog.math.Long} The bitwise-NOT of this value. */
goog.math.Long.prototype.not = function() {
  return goog.math.Long.fromBits(~this.low_, ~this.high_);
};


/**
 * Returns the bitwise-AND of this Long and the given one.
 * @param {goog.math.Long} other The Long with which to AND.
 * @return {!goog.math.Long} The bitwise-AND of this and the other.
 */
goog.math.Long.prototype.and = function(other) {
  return goog.math.Long.fromBits(this.low_ & other.low_,
                                 this.high_ & other.high_);
};


/**
 * Returns the bitwise-OR of this Long and the given one.
 * @param {goog.math.Long} other The Long with which to OR.
 * @return {!goog.math.Long} The bitwise-OR of this and the other.
 */
goog.math.Long.prototype.or = function(other) {
  return goog.math.Long.fromBits(this.low_ | other.low_,
                                 this.high_ | other.high_);
};


/**
 * Returns the bitwise-XOR of this Long and the given one.
 * @param {goog.math.Long} other The Long with which to XOR.
 * @return {!goog.math.Long} The bitwise-XOR of this and the other.
 */
goog.math.Long.prototype.xor = function(other) {
  return goog.math.Long.fromBits(this.low_ ^ other.low_,
                                 this.high_ ^ other.high_);
};


/**
 * Returns this Long with bits shifted to the left by the given amount.
 * @param {number} numBits The number of bits by which to shift.
 * @return {!goog.math.Long} This shifted to the left by the given amount.
 */
goog.math.Long.prototype.shiftLeft = function(numBits) {
  numBits &= 63;
  if (numBits == 0) {
    return this;
  } else {
    var low = this.low_;
    if (numBits < 32) {
      var high = this.high_;
      return goog.math.Long.fromBits(
          low << numBits,
          (high << numBits) | (low >>> (32 - numBits)));
    } else {
      return goog.math.Long.fromBits(0, low << (numBits - 32));
    }
  }
};


/**
 * Returns this Long with bits shifted to the right by the given amount.
 * @param {number} numBits The number of bits by which to shift.
 * @return {!goog.math.Long} This shifted to the right by the given amount.
 */
goog.math.Long.prototype.shiftRight = function(numBits) {
  numBits &= 63;
  if (numBits == 0) {
    return this;
  } else {
    var high = this.high_;
    if (numBits < 32) {
      var low = this.low_;
      return goog.math.Long.fromBits(
          (low >>> numBits) | (high << (32 - numBits)),
          high >> numBits);
    } else {
      return goog.math.Long.fromBits(
          high >> (numBits - 32),
          high >= 0 ? 0 : -1);
    }
  }
};


/**
 * Returns this Long with bits shifted to the right by the given amount, with
 * zeros placed into the new leading bits.
 * @param {number} numBits The number of bits by which to shift.
 * @return {!goog.math.Long} This shifted to the right by the given amount, with
 *     zeros placed into the new leading bits.
 */
goog.math.Long.prototype.shiftRightUnsigned = function(numBits) {
  numBits &= 63;
  if (numBits == 0) {
    return this;
  } else {
    var high = this.high_;
    if (numBits < 32) {
      var low = this.low_;
      return goog.math.Long.fromBits(
          (low >>> numBits) | (high << (32 - numBits)),
          high >>> numBits);
    } else if (numBits == 32) {
      return goog.math.Long.fromBits(high, 0);
    } else {
      return goog.math.Long.fromBits(high >>> (numBits - 32), 0);
    }
  }
};
/*
  simple set with reasonably fast iteration though an array, which may contain nulls
  elements must be objects that have a unique _key property
  collections are expected to be homogeneous

  when iterating over a set with an iterator, the following operations are safe:

   - adding an element to the set (the existing iterator will iterate over the new elements)
   - removing the last returned element through the iterator

   behaviour for deleting elements is unpredictable and unsafe
*/

/** @constructor */
function h$Set(s) {
    this._vals = [];
    this._keys = [];
    this._size = 0;
}

h$Set.prototype.size = function() {
    return this._size;
}

h$Set.prototype.add = function(o) {
    var k = this._keys, v = this._vals;
    if(k[o._key] === undefined) {
        k[o._key] = this._size;
        v[this._size++] = o;
    }
}

h$Set.prototype.remove = function(o) {
    if(this._size === 0) return;
    var k = this._keys, v = this._vals, x = k[o._key];
    if(x !== undefined) {
        delete k[o._key];
        var ls = --this._size;
        if(ls !== x) {
            var l = v[ls];
            v[x] = l;
            k[l._key] = x;
        }
        v[ls] = undefined;
        if(v.length > 10 && 2 * v.length > 3 * ls) this._vals = v.slice(0, ls);
    }
}

h$Set.prototype.has = function(o) {
    return this._keys[o._key] !== undefined;
}

h$Set.prototype.clear = function() {
    if(this._size > 0) {
 this._keys = [];
 this._vals = [];
 this._size = 0;
    }
}

h$Set.prototype.iter = function() {
    return new h$SetIter(this);
}

// returns an array with all values, might contain additional nulls at the end
h$Set.prototype.values = function() {
    return this._vals;
}

/** @constructor */
function h$SetIter(s) {
    this._n = 0;
    this._s = s;
    this._r = true;
}

h$SetIter.prototype.next = function() {
    if(this._n < this._s._size) {
        this._r = false;
        return this._s._vals[this._n++];
    } else {
        this._r = true;
        return null;
    }
}

h$SetIter.prototype.peek = function() {
    if(this._n < this._s._size) {
        return this._s._vals[this._n];
    } else {
        return null;
    }
}

// remove the last element returned
h$SetIter.prototype.remove = function() {
    if(!this._r) {
        this._s.remove(this._s._vals[--this._n]);
        this._r = true;
    }
}

/*
  map, iteration restrictions are the same as for set
  keys need to be objects with a unique _key property

  keys are expected to have the same prototype

  values may be anything (but note that the values array might have additional nulls)
*/

/** @constructor */
function h$Map() {
    this._pairsKeys = [];
    this._pairsValues = [];
    this._keys = [];
    this._size = 0;
}

h$Map.prototype.size = function() {
    return this._size;
}

h$Map.prototype.put = function(k,v) {
    var ks = this._keys, pk = this._pairsKeys, pv = this._pairsValues, x = ks[k._key];
    if(x === undefined) {
        var n = this._size++;
        ks[k._key] = n;
        pk[n] = k;
        pv[n] = v;
    } else {
        pv[x] = v;
    }
}

h$Map.prototype.remove = function(k) {
    var kk = k._key, ks = this._keys, pk = this._pairsKeys, pv = this._pairsValues, x = ks[kk];
    if(x !== undefined) {
        delete ks[kk];
        var ss = --this._size;
        if(ss !== x) {
            var pks = pk[ss];
            pk[x] = pks;
            pv[x] = pv[ss];
            ks[pks._key] = x;
        }
        pv[ss] = undefined;
        pk[ss] = undefined;

        if(pk.length > 10 && 2 * pk.length > 3 * this._size) {
            this._pairsKeys = pk.slice(0,ss);
            this._pairsValues = pv.slice(0,ss);
        }
    }
}

h$Map.prototype.has = function(k) {
    return this._keys[k._key] !== undefined;
}

h$Map.prototype.get = function(k) {
    var n = this._keys[k._key];
    if(n !== undefined) {
        return this._pairsValues[n];
    } else {
        return null;
    }
}

h$Map.prototype.iter = function() {
    return new h$MapIter(this);
}

// returned array might have some trailing nulls
h$Map.prototype.keys = function () {
    return this._pairsKeys;
}

// returned array might have some trailing nulls
h$Map.prototype.values = function() {
    return this._pairsValues;
}

/** @constructor */
function h$MapIter(m) {
    this._n = 0;
    this._m = m;
}

h$MapIter.prototype.next = function() {
    return this._n < this._m._size ? this._m._pairsKeys[this._n++] : null;
}

h$MapIter.prototype.nextVal = function() {
    return this._n < this._m._size ? this._m._pairsValues[this._n++] : null;
}

h$MapIter.prototype.peek = function() {
    return this._n < this._m._size ? this._m._pairsKeys[this._n] : null;
}

h$MapIter.prototype.peekVal = function() {
    return this._n < this._m._size ? this._m._pairsValues[this._n] : null;
}

/*
  simple queue, returns null when empty
  it's safe to enqueue new items while iterating, not safe to dequeue
  (new items will not be iterated over)
*/




/** @constructor */
function h$Queue() {
    var b = { b: [], n: null };
    this._blocks = 1;
    this._first = b;
    this._fp = 0;
    this._last = b;
    this._lp = 0;
}

h$Queue.prototype.length = function() {
    return 1000 * (this._blocks - 1) + this._lp - this._fp;
}

h$Queue.prototype.isEmpty = function() {
    return this._blocks === 1 && this._lp >= this._fp;
}

h$Queue.prototype.enqueue = function(o) {
    if(this._lp === 1000) {
        var newBlock = { b: [o], n: null };
        this._blocks++;
        this._last.n = newBlock;
        this._last = newBlock;
        this._lp = 1;
    } else {
        this._last.b[this._lp++] = o;
    }
}

h$Queue.prototype.dequeue = function() {
    if(this._blocks === 1 && this._fp >= this._lp) {
        return null;
    } else {
        var qfb = this._first.b, r = qfb[this._fp];
        qfb[this._fp] = null;
        if(++this._fp === 1000) {
            if(this._blocks === 1) {
                this._lp = 0;
            } else {
                this._blocks--;
                this._first = this._first.n;
            }
            this._fp = 0;
        } else if(this._blocks === 1 && this._fp >= this._lp) {
            this._lp = this._fp = 0;
        }
        return r;
    }
}

h$Queue.prototype.peek = function() {
    if(this._blocks === 0 || (this._blocks === 1 && this._fp >= this._lp)) {
        return null;
    } else {
        return this._first.b[this._fp];
    }
}

h$Queue.prototype.iter = function() {
    var b = this._first, bp = this._fp, lb = this._last, lp = this._lp;
    return function() {
        if(b === null || (b === lb && bp >= lp)) {
            return null;
        } else {
            var r = b.b[bp];
            if(++bp === 1000) {
                b = b.n;
                bp = 0;
                if(b === null) lb = null;
            }
            return r;
        }
    }
}

/*
   binary min-heap / set
   - iteration is not in order of priority
   - values can be removed, need to have the ._key property
*/

/** @constructor */
function h$HeapSet() {
    this._keys = [];
    this._prios = [];
    this._vals = [];
    this._size = 0;
}

h$HeapSet.prototype.size = function() {
    return this._size;
}

// add a node, if it already exists, it's moved to the new priority
h$HeapSet.prototype.add = function(op,o) {
    var p = this._prios, k = this._keys, v = this._vals, x = k[o._key];
    if(x !== undefined) { // adjust node
        var oop = p[x];
        if(oop !== op) {
            p[x] = op;
            if(op < oop) {
                this._upHeap(x);
            } else {
                this._downHeap(x, this._size);
            }
        }
    } else { // new node
        var s = this._size++;
        k[o._key] = s;
        p[s] = op;
        v[s] = o;
        this._upHeap(s);
    }
}

h$HeapSet.prototype.has = function(o) {
    return this._keys[o._key] !== undefined;
}

h$HeapSet.prototype.prio = function(o) {
    var x = this._keys[o._key];
    if(x !== undefined) {
        return this._prios[x];
    } else {
        return null;
    }
}

h$HeapSet.prototype.peekPrio = function() {
    return this._size > 0 ? this._prios[0] : null;
}

h$HeapSet.prototype.peek = function() {
    return this._size > 0 ? this._vals[0] : null;
}

h$HeapSet.prototype.pop = function() {
    if(this._size > 0) {
        var v = this._vals[0];
        this._removeNode(0);
        return v;
    } else {
        return null;
    }
}

h$HeapSet.prototype.remove = function(o) {
    var x = this._keys[o._key];
    if(x !== undefined) this._removeNode(x);
}

h$HeapSet.prototype.iter = function() {
    var n = 0, v = this._vals, s = this._size;
    return function() {
        return n < s ? v[n++] : null;
    }
}

// may be longer than this.size(), remainder is filled with nulls
h$HeapSet.prototype.values = function() {
    return this._vals;
}

h$HeapSet.prototype._removeNode = function(i) {
    var p = this._prios, v = this._vals, s = --this._size, k = this._keys;
    delete k[v[i]._key];
    if(i !== s) {
        v[i] = v[s];
        p[i] = p[s];
        k[v[i]._key] = i;
    }
    v[s] = null;
    p[s] = null;
    this._downHeap(i,s);
}

h$HeapSet.prototype._downHeap = function(i,s) {
    var p = this._prios, v = this._vals, k = this._keys;
    var j,l,r,ti,tj;
    while(true) {
        j = i, r = 2*(i+1), l = r-1;
        if(l < s && p[l] < p[i]) i = l;
        if(r < s && p[r] < p[i]) i = r;
        if(i !== j) {
            ti = v[i];
            tj = v[j];
            v[j] = ti;
            v[i] = tj;
            k[ti._key] = j;
            k[tj._key] = i;
            ti = p[i];
            p[i] = p[j];
            p[j] = ti;
        } else {
            break;
        }
    }
}

h$HeapSet.prototype._upHeap = function(i) {
    var ti, tj, j, p = this._prios, v = this._vals, k = this._keys;
    while(i !== 0) {
        j = (i-1) >> 1;
        if(p[i] < p[j]) {
            ti = v[i];
            tj = v[j];
            v[j] = ti;
            v[i] = tj;
            k[ti._key] = j;
            k[tj._key] = i;
            ti = p[i];
            p[i] = p[j];
            p[j] = ti;
            i = j;
        } else {
            break;
        }
    }
}






// values defined in Gen2.ClosureInfo







// thread status

/*
 * low-level heap object manipulation macros
 */
// GHCJS.Prim.JSVal







// GHCJS.Prim.JSException





// Exception dictionary for JSException


// SomeException






// GHC.Ptr.Ptr






// GHC.Integer.GMP.Internals
// Data.Maybe.Maybe




// #define HS_NOTHING h$nothing






// Data.List
// Data.Text




// Data.Text.Lazy





// black holes
// can we skip the indirection for black holes?






// resumable thunks


// general deconstruction



// retrieve  a numeric value that's possibly stored as an indirection



// generic lazy values
// generic data constructors and selectors
// unboxed tuple returns
// #define RETURN_UBX_TUP1(x) return x;

// #define GHCJS_TRACE_META 1







// memory management and pointer emulation

// static init, non-caf



function h$sti(i,c,xs) {

    i.f = c;



    h$init_closure(i,xs);
}

// static init, caf



function h$stc(i,c,xs) {

    i.f = c;



    h$init_closure(i,xs);
    h$addCAF(i);
}




function h$stl(o, xs, t) {

    var r = t ? t : h$ghczmprimZCGHCziTypesziZMZN;
    var x;
    if(xs.length > 0) {
        for(var i=xs.length-1;i>=0;i--) {
            x = xs[i];
            if(!x && x !== false && x !== 0) throw "h$toHsList: invalid element";
            r = (h$c2(h$ghczmprimZCGHCziTypesziZC_con_e, (x), (r)));
        }
    }
    // fixme direct object manip
    o.f = r.f;
    o.d1 = r.d1;
    o.d2 = r.d2;
    o.m = r.m;



}

// some utilities for constructing common objects from JS in the RTS or foreign code.
// when profiling, the current ccs is assigned

// #ifdef GHCJS_PROF
// var h$nil = h$c(h$ghczmprimZCGHCziTypesziZMZN_con_e, h$CCS_SYSTEM);
// #else
// var h$nil = h$c(h$ghczmprimZCGHCziTypesziZMZN_con_e);
// #endif

// #ifdef GHCJS_PROF
// var h$nothing = h$c(h$baseZCGHCziBaseziNothing_con_e, h$CCS_SYSTEM);
// #else
//var h$nothing = h$c(h$baseZCGHCziBaseziNothing_con_e);
// #endif

// delayed init for top-level closures
var h$staticDelayed = [];
function h$d() {




    var c = h$c(null);

    h$staticDelayed.push(c);
    return c;
}

var h$allocN = 0;
function h$traceAlloc(x) {
    h$log("allocating: " + (++h$allocN));
    x.alloc = h$allocN;
}

// fixme remove this when we have a better way to immediately init these things
function h$di(c) {
    h$staticDelayed.push(c);
}

// initialize global object to primitive value
function h$p(x) {
    h$staticDelayed.push(x);
    return x;
}

var h$entriesStack = [];
var h$staticsStack = [];
var h$labelsStack = [];

function h$scheduleInit(entries, objs, lbls, infos, statics) {
    var d = h$entriesStack.length;
    h$entriesStack.push(entries);
    h$staticsStack.push(objs);
    h$labelsStack.push(lbls);
    h$initStatic.push(function() {
        h$initInfoTables(d, entries, objs, lbls, infos, statics);
    });
}

// initialize packed info tables
// see Gen2.Compactor for how the data is encoded
function h$initInfoTables ( depth // depth in the base chain
                          , funcs // array with all entry functions
                          , objects // array with all the global heap objects
                          , lbls // array with non-haskell labels
                          , infoMeta // packed info
                          , infoStatic
                          ) {
                                    ;
  var n, i, j, o, pos = 0, info;
  function code(c) {
    if(c < 34) return c - 32;
    if(c < 92) return c - 33;
    return c - 34;
  }
  function next() {
    var c = info.charCodeAt(pos);
    if(c < 124) {
                                                        ;
      pos++;
      return code(c);
    }
    if(c === 124) {
      pos+=3;
      var r = 90 + 90 * code(info.charCodeAt(pos-2))
                  + code(info.charCodeAt(pos-1));
                                                      ;
      return r;
    }
    if(c === 125) {
      pos+=4;
      var r = 8190 + 8100 * code(info.charCodeAt(pos-3))
                   + 90 * code(info.charCodeAt(pos-2))
                   + code(info.charCodeAt(pos-1));
                                                      ;
      return r;
    }
    throw ("h$initInfoTables: invalid code in info table: " + c + " at " + pos)
  }
  function nextCh() {
        return next(); // fixme map readable chars
  }
    function nextInt() {
        var n = next();
        var r;
        if(n === 0) {
            var n1 = next();
            var n2 = next();
            r = n1 << 16 | n2;
        } else {
            r = n - 12;
        }
                                       ;
        return r;
    }
    function nextSignificand() {
        var n = next();
        var n1, n2, n3, n4, n5;
        var r;
        if(n < 2) {
            n1 = next();
            n2 = next();
            n3 = next();
            n4 = next();
            n5 = n1 * 281474976710656 + n2 * 4294967296 + n3 * 65536 + n4;
            r = n === 0 ? -n5 : n5;
        } else {
            r = n - 12;
        }
                                              ;
        return r;
    }
    function nextEntry(o) { return nextIndexed("nextEntry", h$entriesStack, o); }
    function nextObj(o) { return nextIndexed("nextObj", h$staticsStack, o); }
    function nextLabel(o) { return nextIndexed("nextLabel", h$labelsStack, o); }
    function nextIndexed(msg, stack, o) {
        var n = (o === undefined) ? next() : o;
        var i = depth;
        while(n >= stack[i].length) {
            n -= stack[i].length;
            i--;
            if(i < 0) throw (msg + ": cannot find item " + n + ", stack length: " + stack.length + " depth: " + depth);
        }
        return stack[i][n];
    }
    function nextArg() {
        var o = next();
        var n, n1, n2, d0, d1, d2, d3;
        var isString = false;
        switch(o) {
        case 0:
                                         ;
            return false;
        case 1:
                                        ;
            return true;
        case 2:
                                         ;
            return 0;
        case 3:
                                         ;
            return 1;
        case 4:
                                 ;
            return nextInt();
        case 5:
                                           ;
            return null;
        case 6:
                                    ;
            n = next();
            switch(n) {
            case 0:
                return -0.0;
            case 1:
                return 0.0;
            case 2:
                return 1/0;
            case 3:
                return -1/0;
            case 4:
                return 0/0;
            case 5:
                n1 = nextInt();
                var ns = nextSignificand();
              if(n1 > 600) {
                return ns * Math.pow(2,n1-600) * Math.pow(2,600);
              } else if(n1 < -600) {
                return ns * Math.pow(2,n1+600) * Math.pow(2,-600);
              } else {
                return ns * Math.pow(2, n1);
              }
            default:
                n1 = n - 36;
                return nextSignificand() * Math.pow(2, n1);
            }
        case 7:
                                    ;
            isString = true;
            // no break, strings are null temrinated UTF8 encoded binary with
        case 8:
                                    ;
            n = next();
            var ba = h$newByteArray(isString ? (n+1) : n);
            var b8 = ba.u8;
            if(isString) b8[n] = 0;
            var p = 0;
            while(n > 0) {
                switch(n) {
                case 1:
                    d0 = next();
                    d1 = next();
                    b8[p] = ((d0 << 2) | (d1 >> 4));
                    break;
                case 2:
                    d0 = next();
                    d1 = next();
                    d2 = next();
                    b8[p++] = ((d0 << 2) | (d1 >> 4));
                    b8[p] = ((d1 << 4) | (d2 >> 2));
                    break;
                default:
                    d0 = next();
                    d1 = next();
                    d2 = next();
                    d3 = next();
                    b8[p++] = ((d0 << 2) | (d1 >> 4));
                    b8[p++] = ((d1 << 4) | (d2 >> 2));
                    b8[p++] = ((d2 << 6) | d3);
                    break;
                }
                n -= 3;
            }
            return ba;
        case 9:
            var isFun = next() === 1;
            var lbl = nextLabel();
            return h$initPtrLbl(isFun, lbl);
        case 10:
            var c = { f: nextEntry(), d1: null, d2: null, m: 0 };
            var n = next();
            var args = [];
            while(n--) {
                args.push(nextArg());
            }
            return h$init_closure(c, args);
        default:
                                               ;
            return nextObj(o-11);
        }
    }
    info = infoMeta; pos = 0;
  for(i=0;i<funcs.length;i++) {
    o = funcs[i];
    var ot;
    var oa = 0;
    var oregs = 256; // one register no skip
    switch(next()) {
      case 0: // thunk
        ot = 0;
        break;
      case 1: // fun
        ot = 1;
        var arity = next();
        var skipRegs = next()-1;
        if(skipRegs === -1) throw "h$initInfoTables: unknown register info for function";
        var skip = skipRegs & 1;
        var regs = skipRegs >>> 1;
        oregs = (regs << 8) | skip;
        oa = arity + ((regs-1+skip) << 8);
        break;
      case 2: // con
        ot = 2;
        oa = next();
        break;
      case 3: // stack frame
        ot = -1;
        oa = 0;
        oregs = next() - 1;
        if(oregs !== -1) oregs = ((oregs >>> 1) << 8) | (oregs & 1);
        break;
      default: throw ("h$initInfoTables: invalid closure type")
    }
    var size = next() - 1;
    var nsrts = next();
    var srt = null;
    if(nsrts > 0) {
      srt = [];
      for(var j=0;j<nsrts;j++) {
          srt.push(nextObj());
      }
    }

    // h$log("result: " + ot + " " + oa + " " + oregs + " [" + srt + "] " + size);
    // h$log("orig: " + o.t + " " + o.a + " " + o.r + " [" + o.s + "] " + o.size);
    // if(ot !== o.t || oa !== o.a || oregs !== o.r || size !== o.size) throw "inconsistent";

    o.t = ot;
    o.i = [];
    o.n = "";
    o.a = oa;
    o.r = oregs;
    o.s = srt;
    o.m = 0;
    o.size = size;
  }
    info = infoStatic;
    pos = 0;
    for(i=0;i<objects.length;i++) {
                                   ;
      o = objects[i];
        // traceMetaObjBefore(o);
      var nx = next();
                                                            ;
      switch(nx) {
      case 0: // no init, could be a primitive value (still in the list since others might reference it)
          // h$log("zero init");
          break;
      case 1: // staticfun
          o.f = nextEntry();
                               ;
        n = next();
                                ;
        if(n === 0) {
          o.d1 = null;
          o.d2 = null;
        } else if(n === 1) {
          o.d1 = nextArg();
          o.d2 = null;
        } else if(n === 2) {
          o.d1 = nextArg();
          o.d2 = nextArg();
        } else {
          for(j=0;j<n;j++) {
            h$setField(o, j, nextArg());
          }
        }

          break;
      case 2: // staticThunk
                                   ;
        o.f = nextEntry();
        n = next();
                                ;
        if(n === 0) {
          o.d1 = null;
          o.d2 = null;
        } else if(n === 1) {
          o.d1 = nextArg();
          o.d2 = null;
        } else if(n === 2) {
          o.d1 = nextArg();
          o.d2 = nextArg();
        } else {
          for(j=0;j<n;j++) {
            h$setField(o, j, nextArg());
          }
        }
          h$addCAF(o);
          break;
      case 3: // staticPrim false, no init
                                        ;
          break;
      case 4: // staticPrim true, no init
                                       ;
          break;
      case 5:
                                 ;
          break;
      case 6: // staticString
                                    ;
          break;
      case 7: // staticBin
                                               ;
          n = next();
          var b = h$newByteArray(n);
          for(j=0;j>n;j++) {
              b.u8[j] = next();
          }
          break;
      case 8: // staticEmptyList
                                       ;
          o.f = h$ghczmprimZCGHCziTypesziZMZN_con_e;
          break;
      case 9: // staticList
                                  ;
          n = next();
          var hasTail = next();
          var c = (hasTail === 1) ? nextObj() : h$ghczmprimZCGHCziTypesziZMZN;
                                         ;
          while(n--) {
              c = (h$c2(h$ghczmprimZCGHCziTypesziZC_con_e, (nextArg()), (c)));
          }
          o.f = c.f;
          o.d1 = c.d1;
          o.d2 = c.d2;
          break;
      case 10: // staticData n args
                                  ;
          n = next();
                                  ;
          o.f = nextEntry();
          for(j=0;j<n;j++) {
              h$setField(o, j, nextArg());
          }
          break;
      case 11: // staticData 0 args
                                   ;
          o.f = nextEntry();
          break;
      case 12: // staticData 1 args
                                   ;
          o.f = nextEntry();
          o.d1 = nextArg();
          break;
      case 13: // staticData 2 args
                                   ;
          o.f = nextEntry();
          o.d1 = nextArg();
          o.d2 = nextArg();
          break;
      case 14: // staticData 3 args
                                   ;
          o.f = nextEntry();
          o.d1 = nextArg();
          // should be the correct order
          o.d2 = { d1: nextArg(), d2: nextArg()};
          break;
      case 15: // staticData 4 args
                                   ;
          o.f = nextEntry();
          o.d1 = nextArg();
          // should be the correct order
          o.d2 = { d1: nextArg(), d2: nextArg(), d3: nextArg() };
          break;
      case 16: // staticData 5 args
                                   ;
          o.f = nextEntry();
          o.d1 = nextArg();
          o.d2 = { d1: nextArg(), d2: nextArg(), d3: nextArg(), d4: nextArg() };
          break;
      case 17: // staticData 6 args
                                   ;
          o.f = nextEntry();
          o.d1 = nextArg();
          o.d2 = { d1: nextArg(), d2: nextArg(), d3: nextArg(), d4: nextArg(), d5: nextArg() };
          break;
      default:
          throw ("invalid static data initializer: " + nx);
      }
  }
  h$staticDelayed = null;
}

function h$initPtrLbl(isFun, lbl) {
    return lbl;
}

function h$callDynamic(f) {
    return f.apply(f, Array.prototype.slice.call(arguments, 2));
}

// slice an array of heap objects
function h$sliceArray(a, start, n) {
  var r = a.slice(start, start+n);
  r.__ghcjsArray = true;
  r.m = 0;
  return r;
}

function h$memcpy() {
  if(arguments.length === 3) { // ByteArray# -> ByteArray# copy
    var dst = arguments[0];
    var src = arguments[1];
    var n = arguments[2];
    for(var i=n-1;i>=0;i--) {
      dst.u8[i] = src.u8[i];
    }
    { h$ret1 = (0); return (dst); };
  } else if(arguments.length === 5) { // Addr# -> Addr# copy
    var dst = arguments[0];
    var dst_off = arguments[1]
    var src = arguments[2];
    var src_off = arguments[3];
    var n = arguments[4];
    for(var i=n-1;i>=0;i--) {
      dst.u8[i+dst_off] = src.u8[i+src_off];
    }
    { h$ret1 = (dst_off); return (dst); };
  } else {
    throw "h$memcpy: unexpected argument";
  }
}

// note: only works for objects bigger than two!
function h$setField(o,n,v) {
    if(n > 0 && !o.d2) o.d2 = {};
    switch(n) {
    case 0:
        o.d1 = v;
        return;
    case 1:
        o.d2.d1 = v;
        return;
    case 2:
        o.d2.d2 = v;
        return;
    case 3:
        o.d2.d3 = v;
        return;
    case 4:
        o.d2.d4 = v;
        return;
    case 5:
        o.d2.d5 = v;
        return;
    case 6:
        o.d2.d6 = v;
        return;
    case 7:
        o.d2.d7 = v;
        return;
    case 8:
        o.d2.d8 = v;
        return;
    case 9:
        o.d2.d9 = v;
        return;
    case 10:
        o.d2.d10 = v;
        return;
    case 11:
        o.d2.d11 = v;
        return;
    case 12:
        o.d2.d12 = v;
        return;
    case 13:
        o.d2.d13 = v;
        return;
    case 14:
        o.d2.d14 = v;
        return;
    case 15:
        o.d2.d15 = v;
        return;
    case 16:
        o.d2.d16 = v;
        return;
    case 17:
        o.d2.d17 = v;
        return;
    case 18:
        o.d2.d18 = v;
        return;
    case 19:
        o.d2.d19 = v;
        return;
    case 20:
        o.d2.d20 = v;
        return;
    case 21:
        o.d2.d21 = v;
        return;
    case 22:
        o.d2.d22 = v;
        return;
    case 23:
        o.d2.d23 = v;
        return;
    case 24:
        o.d2.d24 = v;
        return;
    case 25:
        o.d2.d25 = v;
        return;
    case 26:
        o.d2.d26 = v;
        return;
    case 27:
        o.d2.d27 = v;
        return;
    case 28:
        o.d2.d28 = v;
        return;
    case 29:
        o.d2.d29 = v;
        return;
    case 30:
        o.d2.d30 = v;
        return;
    case 31:
        o.d2.d31 = v;
        return;
    case 32:
        o.d2.d32 = v;
        return;
    case 33:
        o.d2.d33 = v;
        return;
    case 34:
        o.d2.d34 = v;
        return;
    case 35:
        o.d2.d35 = v;
        return;
    case 36:
        o.d2.d36 = v;
        return;
    case 37:
        o.d2.d37 = v;
        return;
    case 38:
        o.d2.d38 = v;
        return;
    case 39:
        o.d2.d39 = v;
        return;
    case 40:
        o.d2.d40 = v;
        return;
    case 41:
        o.d2.d41 = v;
        return;
    case 42:
        o.d2.d42 = v;
        return;
    case 43:
        o.d2.d43 = v;
        return;
    case 44:
        o.d2.d44 = v;
        return;
    case 45:
        o.d2.d45 = v;
        return;
    case 45:
        o.d2.d45 = v;
        return;
    case 46:
        o.d2.d46 = v;
        return;
    case 47:
        o.d2.d47 = v;
        return;
    case 48:
        o.d2.d48 = v;
        return;
    case 49:
        o.d2.d49 = v;
        return;
    case 50:
        o.d2.d50 = v;
        return;
    case 51:
        o.d2.d51 = v;
        return;
    case 52:
        o.d2.d52 = v;
        return;
    case 53:
        o.d2.d53 = v;
        return;
    case 54:
        o.d2.d54 = v;
        return;
    case 55:
        o.d2.d55 = v;
        return;
    case 56:
        o.d2.d56 = v;
        return;
    case 57:
        o.d2.d57 = v;
        return;
    case 58:
        o.d2.d58 = v;
        return;
    case 59:
        o.d2.d59 = v;
        return;
    case 60:
        o.d2.d60 = v;
        return;
    case 61:
        o.d2.d61 = v;
        return;
    case 62:
        o.d2.d62 = v;
        return;
    case 63:
        o.d2.d63 = v;
        return;
    case 64:
        o.d2.d64 = v;
        return;
    case 65:
        o.d2.d65 = v;
        return;
    case 66:
        o.d2.d66 = v;
        return;
    case 67:
        o.d2.d67 = v;
        return;
    case 68:
        o.d2.d68 = v;
        return;
    case 69:
        o.d2.d69 = v;
        return;
    case 70:
        o.d2.d70 = v;
        return;
    case 71:
        o.d2.d71 = v;
        return;
    case 72:
        o.d2.d72 = v;
        return;
    case 73:
        o.d2.d73 = v;
        return;
    case 74:
        o.d2.d74 = v;
        return;
    case 75:
        o.d2.d75 = v;
        return;
    case 76:
        o.d2.d76 = v;
        return;
    case 77:
        o.d2.d77 = v;
        return;
    case 78:
        o.d2.d78 = v;
        return;
    case 79:
        o.d2.d79 = v;
        return;
    case 80:
        o.d2.d80 = v;
        return;
    case 81:
        o.d2.d81 = v;
        return;
    case 82:
        o.d2.d82 = v;
        return;
    case 83:
        o.d2.d83 = v;
        return;
    case 84:
        o.d2.d84 = v;
        return;
    case 85:
        o.d2.d85 = v;
        return;
    case 86:
        o.d2.d86 = v;
        return;
    case 87:
        o.d2.d87 = v;
        return;
    case 88:
        o.d2.d88 = v;
        return;
    case 89:
        o.d2.d89 = v;
        return;
    case 90:
        o.d2.d90 = v;
        return;
    case 91:
        o.d2.d91 = v;
        return;
    case 92:
        o.d2.d92 = v;
        return;
    case 93:
        o.d2.d93 = v;
        return;
    case 94:
        o.d2.d94 = v;
        return;
    case 95:
        o.d2.d95 = v;
        return;
    case 96:
        o.d2.d96 = v;
        return;
    case 97:
        o.d2.d97 = v;
        return;
    case 98:
        o.d2.d98 = v;
        return;
    case 99:
        o.d2.d99 = v;
        return;
    case 100:
        o.d2.d100 = v;
        return;
    case 101:
        o.d2.d101 = v;
        return;
    case 102:
        o.d2.d102 = v;
        return;
    case 103:
        o.d2.d103 = v;
        return;
    case 104:
        o.d2.d104 = v;
        return;
    case 105:
        o.d2.d105 = v;
        return;
    case 106:
        o.d2.d106 = v;
        return;
    case 107:
        o.d2.d107 = v;
        return;
    default:
        throw ("h$setField: setter not implemented for field: " + n);
    }
}


function h$mkExportDyn(t, f) {
    h$log("making dynamic export: " + t);
    h$log("haskell fun: " + f + " " + h$collectProps(f));

    // fixme register things, global static data
    var ff = function() {
        h$log("running some haskell for you");
        return 12;
    };
    return h$mkPtr(ff, 0);
}

function h$memchr(a_v, a_o, c, n) {
  for(var i=0;i<n;i++) {
    if(a_v.u8[a_o+i] === c) {
      { h$ret1 = (a_o+i); return (a_v); };
    }
  }
  { h$ret1 = (0); return (null); };
}

function h$strlen(a_v, a_o) {
  var i=0;
  while(true) {
    if(a_v.u8[a_o+i] === 0) { return i; }
    i++;
  }
}

function h$newArray(len, e) {
    var r = [];
    r.__ghcjsArray = true;
    r.m = 0;
    if(e === null) e = r;
    for(var i=0;i<len;i++) r[i] = e;
    return r;
}

function h$roundUpToMultipleOf(n,m) {
  var rem = n % m;
  return rem === 0 ? n : n - rem + m;
}

function h$newByteArray(len) {
  var len0 = Math.max(h$roundUpToMultipleOf(len, 8), 8);
  var buf = new ArrayBuffer(len0);
  return { buf: buf
         , len: len
         , i3: new Int32Array(buf)
         , u8: new Uint8Array(buf)
         , u1: new Uint16Array(buf)
         , f3: new Float32Array(buf)
         , f6: new Float64Array(buf)
         , dv: new DataView(buf)
         }
}

/*
  Unboxed arrays in GHC use the ByteArray# and MutableByteArray#
  primitives. In GHCJS these primitives are represented by an
  object that contains a JavaScript ArrayBuffer and several views
  (typed arrays) on that buffer.

  Usually you can use GHCJS.Foreign.wrapBuffer and
  GHCJS.Foreign.wrapMutableBuffer to do the conversion. If you need
  more control or lower level acces, read on.

  You can use h$wrapBuffer to wrap any JavaScript ArrayBuffer
  into such an object, without copying the buffer. Since typed array
  access is aligned, not all views are available
  if the offset of the buffer is not a multiple of 8.

  Since IO has kind * -> *, you cannot return IO ByteArray#
  from a foreign import, even with the UnliftedFFITypes
  extension. Return a JSVal instead and use unsafeCoerce
  to convert it to a Data.Primitive.ByteArray.ByteArray or
  Data.Primitive.ByteArray.MutableByteArray (primitive package)
  and pattern match on the constructor to get the
  primitive value out.

  These types have the same runtime representation (a data
  constructor with one regular (one JavaScript variable)
  field) as a JSVal, so the conversion is safe, as long
  as everything is fully evaluated.
*/
function h$wrapBuffer(buf, unalignedOk, offset, length) {
  if(!unalignedOk && offset && offset % 8 !== 0) {
    throw ("h$wrapBuffer: offset not aligned:" + offset);
  }
  if(!buf || !(buf instanceof ArrayBuffer))
    throw "h$wrapBuffer: not an ArrayBuffer"
  if(!offset) { offset = 0; }
  if(!length || length < 0) { length = buf.byteLength - offset; }
  return { buf: buf
         , len: length
         , i3: (offset%4) ? null : new Int32Array(buf, offset, length >> 2)
         , u8: new Uint8Array(buf, offset, length)
         , u1: (offset%2) ? null : new Uint16Array(buf, offset, length >> 1)
         , f3: (offset%4) ? null : new Float32Array(buf, offset, length >> 2)
         , f6: (offset%8) ? null : new Float64Array(buf, offset, length >> 3)
         , dv: new DataView(buf, offset, length)
         };
}

var h$arrayBufferCounter = 0;

function h$arrayBufferId(a) {
  if (a.__ghcjsArrayBufferId === undefined)
    a.__ghcjsArrayBufferId = h$arrayBufferCounter++;
  return a.__ghcjsArrayBufferId;
}

function h$comparePointer(a1,o1,a2,o2) {
  if (a1 === null) {
    return a2 === null ? 0 : -1;
  } else if (a2 === null) {
    return 1;
  }
  var i1 = h$arrayBufferId(a1.buf);
  var i2 = h$arrayBufferId(a2.buf);
  if (i1 === i2) {
    var bo1 = a1.dv.byteOffset + o1;
    var bo2 = a2.dv.byteOffset + o2;
    return bo1 === bo2 ? 0 : (bo1 < bo2 ? -1 : 1);
  }
  else
    return i1 < i2 ? -1 : 1;
}

/*
   A StableName is represented as either a h$StableName object (for most heap objects)
   or a number (for heap objects with unboxed representation)

   Holding on to a StableName does not keep the original object alive.
 */
var h$stableNameN = 1;
/** @constructor */
function h$StableName(m) {
  this.m = m;
  this.s = null;
}

function h$makeStableName(x) {
  if(typeof x === 'number') {
    return x;
  } else if(((typeof(x)==='object')&&(x).f === h$unbox_e)) {
    return ((typeof(x) === 'number')?(x):(x).d1);
  } else if(typeof x === 'object') {
    if(typeof x.m !== 'object') {
      x.m = new h$StableName(x.m);
    }
    return x.m;
  } else {
    throw new Error("h$makeStableName: invalid argument");
  }
}

function h$stableNameInt(s) {
  if(typeof s === 'number') {
    if(s!=s) return 999999; // NaN
    var s0 = s|0;
    if(s0 === s) return s0;
    h$convertDouble[0] = s;
    return h$convertInt[0] ^ h$convertInt[1];
  } else {
    var x = s.s;
    if(x === null) {
      x = s.s = h$stableNameN = (h$stableNameN+1)|0;
    }
    return x;
  }
}

function h$eqStableName(s1o,s2o) {
  if(s1o!=s1o && s2o!=s2o) return 1; // NaN
  return s1o === s2o ? 1 : 0;
}

function h$malloc(n) {
  { h$ret1 = (0); return (h$newByteArray(n)); };
}

function h$free() {

}

function h$memset() {
  var buf_v, buf_off, chr, n;
  buf_v = arguments[0];
  if(arguments.length == 4) { // Addr#
    buf_off = arguments[1];
    chr = arguments[2];
    n = arguments[3];
  } else if(arguments.length == 3) { // ByteString#
    buf_off = 0;
    chr = arguments[1];
    n = arguments[2];
  } else {
    throw("h$memset: unexpected argument")
  }
  var end = buf_off + n;
  for(var i=buf_off;i<end;i++) {
    buf_v.u8[i] = chr;
  }
  { h$ret1 = (buf_off); return (buf_v); };
}

function h$memcmp(a_v, a_o, b_v, b_o, n) {
  for(var i=0;i<n;i++) {
    var a = a_v.u8[a_o+i];
    var b = b_v.u8[b_o+i];
    var c = a-b;
    if(c !== 0) { return c; }
  }
  return 0;
}

function h$memmove(a_v, a_o, b_v, b_o, n) {
  if(n > 0) {
    var tmp = new Uint8Array(b_v.buf.slice(b_o,b_o+n));
    for(var i=0;i<n;i++) {
      a_v.u8[a_o+i] = tmp[i];
    }
  }
  { h$ret1 = (a_o); return (a_v); };
}
function h$mkPtr(v, o) {
  return (h$c2(baseZCGHCziPtrziPtr_con_e, (v), (o)));
};
function h$mkFunctionPtr(f) {
  var d = h$newByteArray(4);
  d.arr = [f];
  return d;
}
var h$freeHaskellFunctionPtr = function () {
}

// extra roots for the heap scanner: objects with root property
var h$extraRootsN = 0;
var h$extraRoots = new h$Set();

function h$makeCallback(f, extraArgs, action) {
    var args = extraArgs.slice(0);
    args.unshift(action);
    var c = function() {
        return f.apply(this, args);
    }
    c._key = ++h$extraRootsN;
    c.root = action;
    h$extraRoots.add(c);
    return c;
}

function h$makeCallbackApply(n, f, extraArgs, fun) {
  var c;
  if(n === 1) {
    c = function(x) {
      var args = extraArgs.slice(0);
      var action = (h$c2(h$ap1_e,(fun),((h$c1(h$ghcjszmprimZCGHCJSziPrimziJSVal_con_e, (x))))));
      args.unshift(action);
      return f.apply(this, args);
    }
  } else if (n === 2) {
    c = function(x,y) {
      var args = extraArgs.slice(0);
      var action = (h$c3(h$ap2_e,(fun),((h$c1(h$ghcjszmprimZCGHCJSziPrimziJSVal_con_e, (x)))),((h$c1(h$ghcjszmprimZCGHCJSziPrimziJSVal_con_e, (y))))));
      args.unshift(action);
      return f.apply(this, args);
    }
  } else if (n === 3) {
    c = function(x,y,z) {
      var args = extraArgs.slice(0);
      var action = (h$c2(h$ap1_e,((h$c3(h$ap2_e,(fun),((h$c1(h$ghcjszmprimZCGHCJSziPrimziJSVal_con_e, (x)))),((h$c1(h$ghcjszmprimZCGHCJSziPrimziJSVal_con_e, (y))))))),((h$c1(h$ghcjszmprimZCGHCJSziPrimziJSVal_con_e, (z))))));
      args.unshift(action);
      return f.apply(this, args);
    }
  } else {
    throw new Error("h$makeCallbackApply: unsupported arity");
  }
  c.root = fun;
  c._key = ++h$extraRootsN;
  h$extraRoots.add(c);
  return c;
}

function h$retain(c) {
  var k = c._key;
  if(typeof k !== 'number') throw new Error("retained object does not have a key");
  if(k === -1) c._key = ++h$extraRootsN;
  h$extraRoots.add(c);
}

function h$release(c) {
  h$extraRoots.remove(c);
}

function h$isInstanceOf(o,c) {
  return o instanceof c;
}

function h$getpagesize() {
  return 4096;
}

var h$MAP_ANONYMOUS = 0x20;
function h$mmap(addr_d, addr_o, len, prot, flags, fd, offset1, offset2) {
  if(flags & h$MAP_ANONYMOUS || fd === -1) {
    { h$ret1 = (0); return (h$newByteArray(len)); };
  } else {
    throw "h$mmap: mapping a file is not yet supported";
  }
}

function h$mprotect(addr_d, addr_o, size, prot) {
  return 0;
}

function h$munmap(addr_d, addr_o, size) {
  if(addr_d && addr_o === 0 && size >= addr_d.len) {
    addr_d.buf = null;
    addr_d.i3 = null;
    addr_d.u8 = null;
    addr_d.u1 = null;
    addr_d.f3 = null;
    addr_d.f6 = null;
    addr_d.dv = null;
  }
  return 0;
}






// values defined in Gen2.ClosureInfo







// thread status

/*
 * low-level heap object manipulation macros
 */
// GHCJS.Prim.JSVal







// GHCJS.Prim.JSException





// Exception dictionary for JSException


// SomeException






// GHC.Ptr.Ptr






// GHC.Integer.GMP.Internals
// Data.Maybe.Maybe




// #define HS_NOTHING h$nothing






// Data.List
// Data.Text




// Data.Text.Lazy





// black holes
// can we skip the indirection for black holes?






// resumable thunks


// general deconstruction



// retrieve  a numeric value that's possibly stored as an indirection



// generic lazy values
// generic data constructors and selectors
// unboxed tuple returns
// #define RETURN_UBX_TUP1(x) return x;








function h$compactNew(size) {
                                    ;
  throw new Error("not implemented");
}

function h$compactResize(compact, size) {
                                       ;
}

function h$compactContains(compact, obj) {
                                  ;
  return 0;
}

function h$compactContainsAny(obj) {
                                     ;
  return 0;
}

function h$compactGetFirstBlock(compact) {
                                       ;
  { h$ret1 = (0); return (null); };
}

function h$compactGetNextBlock(compact, blocka, blokco) {
                                      ;
  { h$ret1 = (0); return (null); };
}

function h$compactAllocateBlock(size, suggesta, suggesto) {
                                              ;
  throw new Error("not implemented");
  // returns new root address
  { h$ret1 = (0); return (null); };
}

function h$compactFixupPointers(blocka, blocko, roota, rooto) {
                                       ;
  throw new Error("not implemented");
  // returns new root address
  { h$ret1 = (0); return (null); };
}


function h$compactAdd(compact, obj) {
                             ;
  throw new Error("not implemented");
}


function h$compactAddWithSharing(compact, obj) {
                                        ;
  throw new Error("not implemented");
}


function h$compactCompactSize(compact) {
                              ;
  return 0;
}
/*
  Do garbage collection where the JavaScript GC doesn't suffice or needs some help:

  - run finalizers for weak references
  - find unreferenced CAFs and reset them (unless h$retainCAFs is set)
  - shorten stacks that are mostly empty
  - reset unused parts of stacks to null
  - reset registers to null
  - reset return variables to null
  - throw exceptions to threads that are blocked on an unreachable MVar/STM transaction
  - drop unnecessary references for selector thunks

  The gc uses the .m field to store its mark in all the objects it marks. for heap objects,
  the .m field is also used for other things, like stable names, the gc only changes
  the two least significant bits for these.

  The gc starts with all threads as roots in addition to callbacks passed to JavaScript
  that that are retained. If you have custom JavaScript data structures that contain
  Haskell heap object references, you can use extensible retention to find these
  references and add thm to the work queue. h$registerExtensibleRetensionRoot(f) calls
  f(currentMark) at the start of every gc, h$registerExtensibleRetention(f) calls f(o, currentMark)
  for every unknown object found on the Haskell heap.

  Extensible retention is a low-level mechanism and should typically only be used by
  bindings that guarantee that the shape of the JS objects exactly matches what
  the scanner expects. Care should be taken to make sure that the objects never
  escape the reach of the scanner.

  Having correct reachability information is important, even if you choose to turn off
  features like weak references and deallocating CAFs in production, since it helps
  debugging by providing the profiler with accurate data and by properly raising
  exceptions when threads become blocked indefinitely, usually indicating a bug or
  memory leak.

  assumptions:
  - all threads suspended, no active registers
  - h$currentThread == null or at least unused:
       1. all reachable threads must be in h$threads or h$blocked
       2. no registers contain any usable value
  notes:
  - gc() may replace the stack of any thread, make sure to reload h$stack after gc()
*/

/*
  fixme, todo:
  - mark posted exceptions to thread
*/








// values defined in Gen2.ClosureInfo







// thread status

/*
 * low-level heap object manipulation macros
 */
// GHCJS.Prim.JSVal







// GHCJS.Prim.JSException





// Exception dictionary for JSException


// SomeException






// GHC.Ptr.Ptr






// GHC.Integer.GMP.Internals
// Data.Maybe.Maybe




// #define HS_NOTHING h$nothing






// Data.List
// Data.Text




// Data.Text.Lazy





// black holes
// can we skip the indirection for black holes?






// resumable thunks


// general deconstruction



// retrieve  a numeric value that's possibly stored as an indirection



// generic lazy values
// generic data constructors and selectors
// unboxed tuple returns
// #define RETURN_UBX_TUP1(x) return x;








// these macros use a local mark variable




var h$gcMark = 2; // 2 or 3 (objects initialized with 0)
var h$retainCAFs = false;

var h$CAFs = [];
var h$CAFsReset = [];

// 
var h$extensibleRetentionRoots = [];
var h$extensibleRetentionCallbacks = [];


/*
   after registering an extensible extension root f,
   f(currentMark) is called at the start of each gc invocation and is
   expected to return an array with Haskell heap objects
   to be treated as extra roots.
 */
function h$registerExtensibleRetentionRoot(f) {
    h$extensibleRetentionRoots.push(f);
}

function h$unregisterExtensibleRetentionRoot(f) {
    h$extensibleRetentionRoots = h$extensibleRetentionRoots.filter(function(g) { return f !== g; });
}

/*
  after registering an extensible retention callback f,
  f(o, currentMark) is called for every unknown object encountered on the
  Haskell heap. f should return an array with found objects. If no objects
  are found, f should return a boolean indicating whether the gc should skip
  processing the objects with other extensible retention callbacks.

  The gc may encounter the same object multiple times during the same scan,
  so a callback should attempt to quickly return if the object has been scanned
  already.

   return value:
     - array          scan objects contained in array, do not call other extension callbacks
     - true           do not call other extension callbacks with this object
     - false          call other extension callbacks with this object

  Use -DGHCJS_TRACE_GC_UNKNOWN to find the JavaScript objects reachable
  (through JSVal) on the Haskell heap for which none of the registered
  extensible retention callbacks has returned true or an array.
 */
function h$registerExtensibleRetention(f) {
    h$extensibleRetentionCallbacks.push(f);
}

function h$unregisterExtensibleRetention(f) {
    h$extensibleRetentionCallbacks = h$extensibleRetentionCallbacks.filter(function(g) { return f !== g; });
}

// check whether the object is marked by the latest gc
function h$isMarked(obj) {
  return (typeof obj === 'object' || typeof obj === 'function') &&
        ((typeof obj.m === 'number' && (obj.m & 3) === h$gcMark) || (obj.m && typeof obj.m === 'object' && obj.m.m === h$gcMark));
}

// do a quick gc of a thread:
// - reset the stack (possibly shrinking storage for it)
// - reset all global data
// checks all known threads if t is null, but not h$currentThread
function h$gcQuick(t) {



    if(h$currentThread !== null) throw "h$gcQuick: GC can only run when no thread is running";



    h$resetRegisters();
    h$resetResultVars();
    var i;
    if(t !== null) { // reset specified threads
        if(t instanceof h$Thread) { // only thread t
            h$resetThread(t);
        } else { // assume it's an array
            for(var i=0;i<t.length;i++) h$resetThread(t[i]);
        }
    } else { // all threads, h$currentThread assumed unused
        var nt, runnable = h$threads.iter();
        while((nt = runnable()) !== null) h$resetThread(nt);
        var iter = h$blocked.iter();
        while((nt = iter.next()) !== null) h$resetThread(nt);
    }






}

// run full marking for threads in h$blocked and h$threads, optionally t if t /= null



function h$gc(t) {
    if(h$currentThread !== null) throw "h$gc: GC can only be run when no thread is running";





                                                      ;
    h$resetRegisters();
    h$resetResultVars();
    h$gcMark = 5-h$gcMark;
    var i;

    for(i=h$extensibleRetentionRoots.length-1;i>=0;i--) {
      var a = h$extensibleRetentionRoots[i](h$gcMark);
      if(a) h$follow(a, a.length-1);
    }
                                                                                                                ;

    // mark al runnable threads and the running thread
    if(t !== null) {
 h$markThread(t);
 h$resetThread(t);
    }
    var nt, runnable = h$threads.iter();
    while((nt = runnable()) !== null) {
 h$markThread(nt);
 h$resetThread(nt);
    }

    // some blocked threads are always considered reachable, mark them
    //   - delayed threads
    //   - threads blocked on async FFI
    var iter = h$blocked.iter();
    while((nt = iter.next()) !== null) {
        if(nt.delayed ||
    (nt.blockedOn instanceof h$MVar && nt.stack && nt.stack[nt.sp] === h$unboxFFIResult)) {
            h$markThread(nt);
        }
 h$resetThread(nt);
    }
                                                  ;
    iter = h$extraRoots.iter();
    while((nt = iter.next()) !== null) h$follow(nt.root);

                                        ;
    for(i=0;i<h$stablePtrData.length;i++) {
      if(h$stablePtrData[i]) h$follow(h$stablePtrData[i]);
    }

    // clean up threads waiting on unreachable synchronization primitives
    h$resolveDeadlocks();

    // clean up unreachable weak refs
    var toFinalize = h$markRetained();
    h$finalizeWeaks(toFinalize);

    h$finalizeCAFs(); // restore all unreachable CAFs to unevaluated state

    var now = Date.now();
    h$lastGc = now;







}

function h$markWeaks() {
  var i, w, marked, mark = h$gcMark;
  do {
    marked = false;
    for (i = 0; i < h$weakPointerList.length; ++i) {
      w = h$weakPointerList[i];
      if (((w.keym.m & 3) === mark)) {
 if (w.val !== null && !((typeof w.val.m === 'number' && (w.val.m & 3) === mark) || (typeof w.val.m === 'object' && ((w.val.m.m & 3) === mark)))) {
          h$follow(w.val);
   marked = true;
 }
 if (w.finalizer !== null && !((typeof w.finalizer.m === 'number' && (w.finalizer.m & 3) === mark) || (typeof w.finalizer.m === 'object' && ((w.finalizer.m.m & 3) === mark)))) {
          h$follow(w.finalizer);
   marked = true;
 }
      }
    }
  } while(marked);
}


function h$markRetained() {
    var iter, marked, w, i, mark = h$gcMark;
    var newList = [];
    var toFinalize = [];

    /*
      2. Scan the Weak Pointer List. If a weak pointer object has a key that is
      marked (i.e. reachable), then mark all heap reachable from its value
      or its finalizer, and move the weak pointer object to a new list
    */
    do {
                                               ;
        marked = false;

        for (i = 0; i < h$weakPointerList.length; ++i) {
            w = h$weakPointerList[i];
            if (w === null) {
                // don't handle items deleted in earlier iteration
                continue;
            }
            if (((w.keym.m & 3) === mark)) {
                if (w.val !== null && !((typeof w.val.m === 'number' && (w.val.m & 3) === mark) || (typeof w.val.m === 'object' && ((w.val.m.m & 3) === mark)))) {
                    h$follow(w.val);
                }

                if (w.finalizer !== null && !((typeof w.finalizer.m === 'number' && (w.finalizer.m & 3) === mark) || (typeof w.finalizer.m === 'object' && ((w.finalizer.m.m & 3) === mark)))) {
                    h$follow(w.finalizer);
                }

                newList.push(w);
                // instead of removing the item from the h$weakpointerList
                // we set it to null if we push it to newList.
                h$weakPointerList[i] = null;

                marked = true;
            }
        }

        /*
           3. Repeat from step (2), until a complete scan of Weak Pointer List finds
              no weak pointer object with a marked keym.
        */
    } while(marked);


    /*
      4. Scan the Weak Pointer List again. If the weak pointer object is reachable
         then tombstone it. If the weak pointer object has a finalizer then move
         it to the Finalization Pending List, and mark all the heap reachable
         from the finalizer. If the finalizer refers to the key (and/or value),
         this step will "resurrect" it.
    */

    for (i = 0; i < h$weakPointerList.length; ++i) {
        w = h$weakPointerList[i];
        if (w === null) {
            // don't handle items deleted in step 2
            continue;
        }

                                               ;
        if(w.val !== null) {
            w.val = null;
        }

        if(w.finalizer !== null) {
            if(!((typeof w.finalizer.m === 'number' && (w.finalizer.m & 3) === mark) || (typeof w.finalizer.m === 'object' && ((w.finalizer.m.m & 3) === mark)))) {
                                               ;
                h$follow(w.finalizer);
            }
            toFinalize.push(w);
        }
    }

    /*
       5. The list accumulated in step (3) becomes the new Weak Pointer List.
          Mark any unreachable weak pointer objects on this list as reachable.
    */
    h$weakPointerList = newList;

    // marking the weak pointer objects as reachable is not necessary

    return toFinalize;
}

function h$markThread(t) {
    var mark = h$gcMark;
                                                    ;
    if(((typeof t.m === 'number' && (t.m & 3) === mark) || (typeof t.m === 'object' && ((t.m.m & 3) === mark)))) return;
    h$follow(t);
}






// big object, not handled by 0..7 cases
// keep out of h$follow to prevent deopt
function h$followObjGen(c, work, w) {
   work[w++] = c.d1;;
   var d = c.d2;
   for(var x in d) {
//              if(d.hasOwnProperty(x)) {
     work[w++] = d[x];;
//              }
   }
    return w;
}

// follow all references in the object obj and mark them with the current mark
// if sp is a number, obj is assumed to be an array for which indices [0..sp] need
// to be followed (used for thread stacks)
function h$follow(obj, sp) {
    var i, ii, iter, c, work, w;



                         ;
    var work, mark = h$gcMark;
    if(typeof sp === 'number') {
        work = obj.slice(0, sp+1);
        w = sp + 1;
    } else {
        work = [obj];
        w = 1;
    }
    while(w > 0) {
                                                            ;
        c = work[--w];
                                                                ;
        if(c !== null && c !== undefined && typeof c === 'object' && ((typeof c.m === 'number' && (c.m&3) !== mark) || (typeof c.m === 'object' && c.m !== null && typeof c.m.m === 'number' && (c.m.m&3) !== mark))) {
            var doMark = false;
            var cf = c.f;
                                      ;
            if(typeof cf === 'function' && (typeof c.m === 'number' || typeof c.m === 'object')) {
                                                                                ;
                // only change the two least significant bits for heap objects
                if(typeof c.m === 'number') c.m = (c.m&-4)|mark; else c.m.m = (c.m.m & -4)|mark;;
                // dynamic references
                var d = c.d2;
                switch(cf.size) {
                case 0: break;
                case 1: work[w++] = c.d1;; break;
                case 2: { work[w++] = c.d1; work[w++] = d; }; break;
                case 3: var d3=c.d2; { work[w++] = c.d1; work[w++] = d3.d1; work[w++] = d3.d2; }; break;
                case 4: var d4=c.d2; { work[w++] = c.d1; work[w++] = d4.d1; work[w++] = d4.d2; work[w++] = d4.d3; }; break;
                case 5: var d5=c.d2; { work[w++] = c.d1; work[w++] = d5.d1; work[w++] = d5.d2; work[w++] = d5.d3; }; work[w++] = d5.d4;; break;
                case 6: var d6=c.d2; { work[w++] = c.d1; work[w++] = d6.d1; work[w++] = d6.d2; work[w++] = d6.d3; }; { work[w++] = d6.d4; work[w++] = d6.d5; }; break;
                case 7: var d7=c.d2; { work[w++] = c.d1; work[w++] = d7.d1; work[w++] = d7.d2; work[w++] = d7.d3; }; { work[w++] = d7.d4; work[w++] = d7.d5; work[w++] = d7.d6; }; break;
                case 8: var d8=c.d2; { work[w++] = c.d1; work[w++] = d8.d1; work[w++] = d8.d2; work[w++] = d8.d3; }; { work[w++] = d8.d4; work[w++] = d8.d5; work[w++] = d8.d6; work[w++] = d8.d7; }; break;
                case 9: var d9=c.d2; { work[w++] = c.d1; work[w++] = d9.d1; work[w++] = d9.d2; work[w++] = d9.d3; }; { work[w++] = d9.d4; work[w++] = d9.d5; work[w++] = d9.d6; work[w++] = d9.d7; }; work[w++] = d9.d8;; break;
                case 10: var d10=c.d2; { work[w++] = c.d1; work[w++] = d10.d1; work[w++] = d10.d2; work[w++] = d10.d3; }; { work[w++] = d10.d4; work[w++] = d10.d5; work[w++] = d10.d6; work[w++] = d10.d7; }; { work[w++] = d10.d8; work[w++] = d10.d9; }; break;
                case 11: var d11=c.d2; { work[w++] = c.d1; work[w++] = d11.d1; work[w++] = d11.d2; work[w++] = d11.d3; }; { work[w++] = d11.d4; work[w++] = d11.d5; work[w++] = d11.d6; work[w++] = d11.d7; }; { work[w++] = d11.d8; work[w++] = d11.d9; work[w++] = d11.d10; }; break;
                case 12: var d12=c.d2; { work[w++] = c.d1; work[w++] = d12.d1; work[w++] = d12.d2; work[w++] = d12.d3; }; { work[w++] = d12.d4; work[w++] = d12.d5; work[w++] = d12.d6; work[w++] = d12.d7; }; { work[w++] = d12.d8; work[w++] = d12.d9; work[w++] = d12.d10; work[w++] = d12.d11; }; break;
                default: w = h$followObjGen(c,work,w);
                }
                // static references
                var s = cf.s;
                if(s !== null) {
                                                   ;
                    for(var i=0;i<s.length;i++) work[w++] = s[i];;
                }
            } else if(c instanceof h$FastWeak) {
              if(typeof c.m === 'number') c.m = (c.m&-4)|mark; else c.m.m = (c.m.m & -4)|mark;;
              if(c.ticket !== null && !((typeof c.ticket.m === 'number' && (c.ticket.m & 3) === mark) || (typeof c.ticket.m === 'object' && ((c.ticket.m.m & 3) === mark)))) {
                c.ticket = null; // If the ticket isn't reachable, this will let it get cleaned up by the JS gc; if it is reachable, it'll fill this back in
              }
            } else if(c instanceof h$FastWeakTicket) {
              if(typeof c.m === 'number') c.m = (c.m&-4)|mark; else c.m.m = (c.m.m & -4)|mark;;
              if(!((typeof c.val.m === 'number' && (c.val.m & 3) === mark) || (typeof c.val.m === 'object' && ((c.val.m.m & 3) === mark)))) {
                work[w++] = c.val;;
              }
              if(((typeof c.weak.m === 'number' && (c.weak.m & 3) === mark) || (typeof c.weak.m === 'object' && ((c.weak.m.m & 3) === mark)))) {
                // In this case, the weak side has been marked first, which means it's been cleared; restore it
                c.weak.ticket = c;
              }
            } else if(c instanceof h$FastWeakBag) {
              if(typeof c.m === 'number') c.m = (c.m&-4)|mark; else c.m.m = (c.m.m & -4)|mark;;
              var j = 0; // j should always be equal to the number of not-yet-necessarily-dead tickets that have been traversed; this should always be less than or equal to i
              for(i = 0; i < c.tickets.length; i++) {
                // Any nulls left in the array prior to checking on the tickets must be tickets that died in the last GC, so we ignore them
                if(c.tickets[i] !== null) {
                  if(j !== i) {
                    c.tickets[i].pos = j;
                  }
                  if(!((typeof c.tickets[i].m === 'number' && (c.tickets[i].m & 3) === mark) || (typeof c.tickets[i].m === 'object' && ((c.tickets[i].m.m & 3) === mark)))) {
                    // If the ticket isn't reachable, this will let it get cleaned up by the JS gc; if it is reachable, it'll fill this back in
                    c.tickets[j] = null;
                  } else if(j !== i) {
                    // We need to move the item
                    c.tickets[j] = c.tickets[i];
                  } // If it's marked and not moving, don't do anything
                  j++;
                }
              }
              c.tickets.length = j; // Shrink the array if any nulls have been dropped
            } else if(c instanceof h$FastWeakBagTicket) {
              if(typeof c.m === 'number') c.m = (c.m&-4)|mark; else c.m.m = (c.m.m & -4)|mark;;
              if(!((typeof c.val.m === 'number' && (c.val.m & 3) === mark) || (typeof c.val.m === 'object' && ((c.val.m.m & 3) === mark)))) {
                work[w++] = c.val;;
              }
              if(((typeof c.bag.m === 'number' && (c.bag.m & 3) === mark) || (typeof c.bag.m === 'object' && ((c.bag.m.m & 3) === mark)))) {
                // In this case, the weak side has been marked first, which means it's been cleared; restore it
                c.bag.tickets[c.pos] = c;
              }
            } else if(c instanceof h$Weak) {
                if(typeof c.m === 'number') c.m = (c.m&-4)|mark; else c.m.m = (c.m.m & -4)|mark;;
            } else if(c instanceof h$MVar) {
                                        ;
                if(typeof c.m === 'number') c.m = (c.m&-4)|mark; else c.m.m = (c.m.m & -4)|mark;;
                iter = c.writers.iter();
                while((ii = iter()) !== null) {
      work[w++] = ii[1];; // value
      work[w++] = ii[0];; // thread
  }
  iter = c.readers.iter();
  while((ii = iter()) !== null) {
      work[w++] = ii;;
  }
         if(c.waiters) {
    for(i=c.waiters.length-1;i>=0;i--) {
      work[w++] = c.waiters[i];;
    }
  }
                if(c.val !== null && !((typeof c.val.m === 'number' && (c.val.m & 3) === mark) || (typeof c.val.m === 'object' && ((c.val.m.m & 3) === mark)))) work[w++] = c.val;;
            } else if(c instanceof h$MutVar) {
                                          ;
                if(typeof c.m === 'number') c.m = (c.m&-4)|mark; else c.m.m = (c.m.m & -4)|mark;;
                work[w++] = c.val;;
            } else if(c instanceof h$TVar) {
                                        ;
                if(typeof c.m === 'number') c.m = (c.m&-4)|mark; else c.m.m = (c.m.m & -4)|mark;;
                work[w++] = c.val;;
  iter = c.blocked.iter();
  while((ii = iter.next()) !== null) {
      work[w++] = ii;;
  }
  if(c.invariants) {
      iter = c.invariants.iter();
      while((ii = iter.next()) !== null) {
   work[w++] = ii;;
      }
  }
            } else if(c instanceof h$Thread) {
                                          ;
                if(typeof c.m === 'number') c.m = (c.m&-4)|mark; else c.m.m = (c.m.m & -4)|mark;;
                if(c.stack) {
                    for(i=c.sp;i>=0;i--) {
   work[w++] = c.stack[i];;
      }
                }
  for(i=0;i<c.excep.length;i++) {
      work[w++] = c.excep[i];;
  }
            } else if(c instanceof h$Transaction) {
                // - the accessed TVar values don't need to be marked
                // - parents are also on the stack, so they should've been marked already
                                                   ;
                if(typeof c.m === 'number') c.m = (c.m&-4)|mark; else c.m.m = (c.m.m & -4)|mark;;
                for(i=c.invariants.length-1;i>=0;i--) {
      work[w++] = c.invariants[i].action;;
  }
                work[w++] = c.action;;
                iter = c.tvars.iter();
                while((ii = iter.nextVal()) !== null) {
      work[w++] = ii.val;;
  }
            } else if(c instanceof Array && c.__ghcjsArray) {
  // only for Haskell arrays with lifted values
                if(typeof c.m === 'number') c.m = (c.m&-4)|mark; else c.m.m = (c.m.m & -4)|mark;;
                                         ;
                for(i=0;i<c.length;i++) {
                    var x = c[i];
                    if(typeof x === 'object' && x !== null && !((typeof x.m === 'number' && (x.m & 3) === mark) || (typeof x.m === 'object' && ((x.m.m & 3) === mark)))) {
          work[w++] = x;;
      }
                }
            } else if(typeof c === 'object') {
                                                        ;



                for(i=h$extensibleRetentionCallbacks.length-1;i>=0;i--) {
                    var x = h$extensibleRetentionCallbacks[i](c, mark);
                    if(x === false) continue;



                    if(x !== true) {
                      for(j=x.length-1;j>=0;j--) {
            work[w++] = x[j];;
        }
                    }
                    break;
                }





            } // otherwise: not an object, no followable values
        }
    }
                                                      ;
}

// resetThread clears the stack above the stack pointer
// and shortens the stack array if there is too much
// unused space
function h$resetThread(t) {



    var stack = t.stack;
    if(!stack) return;
    var sp = t.sp;
    if(stack.length - sp > sp && stack.length > 100) {
        t.stack = t.stack.slice(0,sp+1);
    } else {
        for(var i=sp+1;i<stack.length;i++) {
            stack[i] = null;
        }
    }
                                                           ;
}

/*
   Post exceptions to all threads that are waiting on an unreachable synchronization
   object and haven't been marked reachable themselves.

   All woken up threads are marked.
 */
function h$resolveDeadlocks() {
                                   ;
    var kill, t, iter, bo, mark = h$gcMark;
    do {
        h$markWeaks();
        // deal with unreachable blocked threads: kill an unreachable thread and restart the process
        kill = null;
        iter = h$blocked.iter();
        while((t = iter.next()) !== null) {
            // we're done if the thread is already reachable
            if(((typeof t.m === 'number' && (t.m & 3) === mark) || (typeof t.m === 'object' && ((t.m.m & 3) === mark)))) continue;

            // check what we're blocked on
            bo = t.blockedOn;
            if(bo instanceof h$MVar) {
                // blocked on MVar
                if(bo.m === mark) throw "assertion failed: thread should have been marked";
                // MVar unreachable
                kill = h$ghcjszmprimZCGHCJSziPrimziInternalziblockedIndefinitelyOnMVar;
                break;
            } else if(t.blockedOn instanceof h$TVarsWaiting) {
                // blocked in STM transaction
                kill = h$ghcjszmprimZCGHCJSziPrimziInternalziblockedIndefinitelyOnSTM;
                break;
            } else {
                // blocked on something else, we can't do anything
            }
        }
        if(kill) {
            h$killThread(t, kill);
            h$markThread(t);
        }
    } while(kill);
}

// register a CAF (after initialising the heap object)
function h$addCAF(o) {
  h$CAFs.push(o);
  h$CAFsReset.push([o.f, o.d1, o.d2]);
}

// reset unreferenced CAFs to their initial value
function h$finalizeCAFs() {
    if(h$retainCAFs) return;



    var mark = h$gcMark;
    for(var i=0;i<h$CAFs.length;i++) {
        var c = h$CAFs[i];
        if(c.m & 3 !== mark) {
            var cr = h$CAFsReset[i];
            if(c.f !== cr[0]) { // has been updated, reset it
                                                  ;
                c.f = cr[0];
                c.d1 = cr[1];
                c.d2 = cr[2];
            }
        }
    }
                                                            ;
}






// values defined in Gen2.ClosureInfo







// thread status

/*
 * low-level heap object manipulation macros
 */
// GHCJS.Prim.JSVal







// GHCJS.Prim.JSException





// Exception dictionary for JSException


// SomeException






// GHC.Ptr.Ptr






// GHC.Integer.GMP.Internals
// Data.Maybe.Maybe




// #define HS_NOTHING h$nothing






// Data.List
// Data.Text




// Data.Text.Lazy





// black holes
// can we skip the indirection for black holes?






// resumable thunks


// general deconstruction



// retrieve  a numeric value that's possibly stored as an indirection



// generic lazy values
// generic data constructors and selectors
// unboxed tuple returns
// #define RETURN_UBX_TUP1(x) return x;





/* include/HsBaseConfig.h.  Generated from HsBaseConfig.h.in by configure.  */
/* include/HsBaseConfig.h.in.  Generated from configure.ac by autoheader.  */

/* The value of E2BIG. */


/* The value of EACCES. */


/* The value of EADDRINUSE. */


/* The value of EADDRNOTAVAIL. */


/* The value of EADV. */


/* The value of EAFNOSUPPORT. */


/* The value of EAGAIN. */


/* The value of EALREADY. */


/* The value of EBADF. */


/* The value of EBADMSG. */


/* The value of EBADRPC. */


/* The value of EBUSY. */


/* The value of ECHILD. */


/* The value of ECOMM. */


/* The value of ECONNABORTED. */


/* The value of ECONNREFUSED. */


/* The value of ECONNRESET. */


/* The value of EDEADLK. */


/* The value of EDESTADDRREQ. */


/* The value of EDIRTY. */


/* The value of EDOM. */


/* The value of EDQUOT. */


/* The value of EEXIST. */


/* The value of EFAULT. */


/* The value of EFBIG. */


/* The value of EFTYPE. */


/* The value of EHOSTDOWN. */


/* The value of EHOSTUNREACH. */


/* The value of EIDRM. */


/* The value of EILSEQ. */


/* The value of EINPROGRESS. */


/* The value of EINTR. */


/* The value of EINVAL. */


/* The value of EIO. */


/* The value of EISCONN. */


/* The value of EISDIR. */


/* The value of ELOOP. */


/* The value of EMFILE. */


/* The value of EMLINK. */


/* The value of EMSGSIZE. */


/* The value of EMULTIHOP. */


/* The value of ENAMETOOLONG. */


/* The value of ENETDOWN. */


/* The value of ENETRESET. */


/* The value of ENETUNREACH. */


/* The value of ENFILE. */


/* The value of ENOBUFS. */


/* The value of ENOCIGAR. */


/* The value of ENODATA. */


/* The value of ENODEV. */


/* The value of ENOENT. */


/* The value of ENOEXEC. */


/* The value of ENOLCK. */


/* The value of ENOLINK. */


/* The value of ENOMEM. */


/* The value of ENOMSG. */


/* The value of ENONET. */


/* The value of ENOPROTOOPT. */


/* The value of ENOSPC. */


/* The value of ENOSR. */


/* The value of ENOSTR. */


/* The value of ENOSYS. */


/* The value of ENOTBLK. */


/* The value of ENOTCONN. */


/* The value of ENOTDIR. */


/* The value of ENOTEMPTY. */


/* The value of ENOTSOCK. */


/* The value of ENOTSUP. */


/* The value of ENOTTY. */


/* The value of ENXIO. */


/* The value of EOPNOTSUPP. */


/* The value of EPERM. */


/* The value of EPFNOSUPPORT. */


/* The value of EPIPE. */


/* The value of EPROCLIM. */


/* The value of EPROCUNAVAIL. */


/* The value of EPROGMISMATCH. */


/* The value of EPROGUNAVAIL. */


/* The value of EPROTO. */


/* The value of EPROTONOSUPPORT. */


/* The value of EPROTOTYPE. */


/* The value of ERANGE. */


/* The value of EREMCHG. */


/* The value of EREMOTE. */


/* The value of EROFS. */


/* The value of ERPCMISMATCH. */


/* The value of ERREMOTE. */


/* The value of ESHUTDOWN. */


/* The value of ESOCKTNOSUPPORT. */


/* The value of ESPIPE. */


/* The value of ESRCH. */


/* The value of ESRMNT. */


/* The value of ESTALE. */


/* The value of ETIME. */


/* The value of ETIMEDOUT. */


/* The value of ETOOMANYREFS. */


/* The value of ETXTBSY. */


/* The value of EUSERS. */


/* The value of EWOULDBLOCK. */


/* The value of EXDEV. */


/* The value of O_BINARY. */


/* The value of SIGINT. */


/* Define to 1 if you have the `clock_gettime' function. */


/* Define to 1 if you have the <ctype.h> header file. */


/* Define if you have epoll support. */
/* #undef HAVE_EPOLL */

/* Define to 1 if you have the `epoll_ctl' function. */
/* #undef HAVE_EPOLL_CTL */

/* Define to 1 if you have the <errno.h> header file. */


/* Define to 1 if you have the `eventfd' function. */
/* #undef HAVE_EVENTFD */

/* Define to 1 if you have the <fcntl.h> header file. */


/* Define if you have flock support. */


/* Define to 1 if you have the `ftruncate' function. */


/* Define to 1 if you have the `getclock' function. */
/* #undef HAVE_GETCLOCK */

/* Define to 1 if you have the `getrusage' function. */


/* Define to 1 if you have the <inttypes.h> header file. */


/* Define to 1 if you have the `iswspace' function. */


/* Define to 1 if you have the `kevent' function. */


/* Define to 1 if you have the `kevent64' function. */


/* Define if you have kqueue support. */


/* Define to 1 if you have the <langinfo.h> header file. */


/* Define to 1 if you have libcharset. */


/* Define to 1 if you have the `rt' library (-lrt). */
/* #undef HAVE_LIBRT */

/* Define to 1 if you have the <limits.h> header file. */


/* Define to 1 if the system has the type `long long'. */


/* Define to 1 if you have the `lstat' function. */


/* Define to 1 if you have the <memory.h> header file. */


/* Define if you have open file descriptor lock support. */
/* #undef HAVE_OFD_LOCKING */

/* Define if you have poll support. */


/* Define to 1 if you have the <poll.h> header file. */


/* Define to 1 if you have the <signal.h> header file. */


/* Define to 1 if you have the <stdint.h> header file. */


/* Define to 1 if you have the <stdlib.h> header file. */


/* Define to 1 if you have the <strings.h> header file. */


/* Define to 1 if you have the <string.h> header file. */


/* Define to 1 if you have the <sys/epoll.h> header file. */
/* #undef HAVE_SYS_EPOLL_H */

/* Define to 1 if you have the <sys/eventfd.h> header file. */
/* #undef HAVE_SYS_EVENTFD_H */

/* Define to 1 if you have the <sys/event.h> header file. */


/* Define to 1 if you have the <sys/file.h> header file. */


/* Define to 1 if you have the <sys/resource.h> header file. */


/* Define to 1 if you have the <sys/select.h> header file. */


/* Define to 1 if you have the <sys/stat.h> header file. */


/* Define to 1 if you have the <sys/syscall.h> header file. */


/* Define to 1 if you have the <sys/timeb.h> header file. */


/* Define to 1 if you have the <sys/timers.h> header file. */
/* #undef HAVE_SYS_TIMERS_H */

/* Define to 1 if you have the <sys/times.h> header file. */


/* Define to 1 if you have the <sys/time.h> header file. */


/* Define to 1 if you have the <sys/types.h> header file. */


/* Define to 1 if you have the <sys/utsname.h> header file. */


/* Define to 1 if you have the <sys/wait.h> header file. */


/* Define to 1 if you have the <termios.h> header file. */


/* Define to 1 if you have the `times' function. */


/* Define to 1 if you have the <time.h> header file. */


/* Define to 1 if you have the <unistd.h> header file. */


/* Define to 1 if you have the `unsetenv' function. */


/* Define to 1 if you have the <utime.h> header file. */


/* Define to 1 if you have the <wctype.h> header file. */


/* Define to 1 if you have the <windows.h> header file. */
/* #undef HAVE_WINDOWS_H */

/* Define to 1 if you have the <winsock.h> header file. */
/* #undef HAVE_WINSOCK_H */

/* Define to 1 if you have the `_chsize' function. */
/* #undef HAVE__CHSIZE */

/* Define to Haskell type for blkcnt_t */


/* Define to Haskell type for blksize_t */


/* Define to Haskell type for bool */


/* Define to Haskell type for cc_t */


/* Define to Haskell type for char */


/* Define to Haskell type for clock_t */


/* Define to Haskell type for dev_t */


/* Define to Haskell type for double */


/* Define to Haskell type for float */


/* Define to Haskell type for fsblkcnt_t */


/* Define to Haskell type for fsfilcnt_t */


/* Define to Haskell type for gid_t */


/* Define to Haskell type for id_t */


/* Define to Haskell type for ino_t */


/* Define to Haskell type for int */


/* Define to Haskell type for intmax_t */


/* Define to Haskell type for intptr_t */


/* Define to Haskell type for long */


/* Define to Haskell type for long long */


/* Define to Haskell type for mode_t */


/* Define to Haskell type for nlink_t */


/* Define to Haskell type for off_t */


/* Define to Haskell type for pid_t */


/* Define to Haskell type for ptrdiff_t */


/* Define to Haskell type for rlim_t */


/* Define to Haskell type for short */


/* Define to Haskell type for signed char */


/* Define to Haskell type for sig_atomic_t */


/* Define to Haskell type for size_t */


/* Define to Haskell type for speed_t */


/* Define to Haskell type for ssize_t */


/* Define to Haskell type for suseconds_t */


/* Define to Haskell type for tcflag_t */


/* Define to Haskell type for timer_t */


/* Define to Haskell type for time_t */


/* Define to Haskell type for uid_t */


/* Define to Haskell type for uintmax_t */


/* Define to Haskell type for uintptr_t */


/* Define to Haskell type for unsigned char */


/* Define to Haskell type for unsigned int */


/* Define to Haskell type for unsigned long */


/* Define to Haskell type for unsigned long long */


/* Define to Haskell type for unsigned short */


/* Define to Haskell type for useconds_t */


/* Define to Haskell type for wchar_t */


/* Define to the address where bug reports for this package should be sent. */


/* Define to the full name of this package. */


/* Define to the full name and version of this package. */


/* Define to the one symbol short name of this package. */


/* Define to the home page for this package. */


/* Define to the version of this package. */


/* The size of `kev.filter', as computed by sizeof. */


/* The size of `kev.flags', as computed by sizeof. */


/* The size of `struct MD5Context', as computed by sizeof. */


/* Define to 1 if you have the ANSI C header files. */


/* Define if stdlib.h declares unsetenv to return void. */
/* #undef UNSETENV_RETURNS_VOID */

/* Enable extensions on AIX 3, Interix.  */



/* Enable GNU extensions on systems that have them.  */



/* Enable threading extensions on Solaris.  */



/* Enable extensions on HP NonStop.  */



/* Enable general extensions on Solaris.  */





/* Enable large inode numbers on Mac OS X 10.5.  */




/* Number of bits in a file offset, on hosts where this is settable. */
/* #undef _FILE_OFFSET_BITS */

/* Define for large files, on AIX-style hosts. */
/* #undef _LARGE_FILES */

/* Define to 1 if on MINIX. */
/* #undef _MINIX */

/* Define to 2 if the system does not provide POSIX.1 features except with
   this defined. */
/* #undef _POSIX_1_SOURCE */

/* Define to 1 if you need to in order for `stat' and other things to work. */
/* #undef _POSIX_SOURCE */








var h$errno = 0;

function h$__hscore_get_errno() {
                                             ;
  return h$errno;
}

function h$unsupported(status, c) {
    h$errno = 12456;
    if(c) c(status);
    return status;
}

function h$strerror(err) {
    if(err === 12456) {
 { h$ret1 = (0); return (h$encodeUtf8("operation unsupported on this platform")); };
    }

    { h$ret1 = (0); return (h$encodeUtf8("unknown error")); };



}

function h$MD5Init(ctx, ctx_off) {
  if(!ctx.arr) { ctx.arr = []; }
  ctx.arr[ctx_off] = new goog.crypt.Md5();
}
var h$__hsbase_MD5Init = h$MD5Init;

function h$MD5Update(ctx, ctx_off, data, data_off, len) {
  var arr = new Uint8Array(data.buf, data_off);
  ctx.arr[ctx_off].update(arr, len);
}
var h$__hsbase_MD5Update = h$MD5Update;

function h$MD5Final(dst, dst_off, ctx, ctx_off) {
  var digest = ctx.arr[ctx_off].digest();
  for(var i=0;i<16;i++) {
    dst.u8[dst_off+i] = digest[i];
  }
}
var h$__hsbase_MD5Final = h$MD5Final;






// values defined in Gen2.ClosureInfo







// thread status

/*
 * low-level heap object manipulation macros
 */
// GHCJS.Prim.JSVal







// GHCJS.Prim.JSException





// Exception dictionary for JSException


// SomeException






// GHC.Ptr.Ptr






// GHC.Integer.GMP.Internals
// Data.Maybe.Maybe




// #define HS_NOTHING h$nothing






// Data.List
// Data.Text




// Data.Text.Lazy





// black holes
// can we skip the indirection for black holes?






// resumable thunks


// general deconstruction



// retrieve  a numeric value that's possibly stored as an indirection



// generic lazy values
// generic data constructors and selectors
// unboxed tuple returns
// #define RETURN_UBX_TUP1(x) return x;

// #define GHCJS_TRACE_ARITH 1
function h$hs_eqWord64(a1,a2,b1,b2) {
  return (a1===b1 && a2===b2) ? 1 : 0;
}

function h$hs_neWord64(a1,a2,b1,b2) {
  return (a1 !== b1 || a2 !== b2) ? 1 : 0;
}

function h$hs_word64ToWord(a1,a2) {
  return a2;
}

function h$hs_wordToWord64(w) {
  { h$ret1 = (w); return (0); };
}

function h$hs_intToInt64(a) {
  { h$ret1 = (a); return ((a < 0) ? -1 : 0); };
}

function h$hs_int64ToWord64(a1,a2) {
  { h$ret1 = (a2); return (a1); };
}

function h$hs_word64ToInt64(a1,a2) {
  { h$ret1 = (a2); return (a1); };
}

function h$hs_int64ToInt(a1,a2) {
  return a2;
}

function h$hs_negateInt64(a1,a2) {
  var c = goog.math.Long.fromBits(a2,a1).negate();
  { h$ret1 = (c.getLowBits()); return (c.getHighBits()); };
}

function h$hs_not64(a1,a2) {
  { h$ret1 = (~a2); return (~a1); };
}

function h$hs_xor64(a1,a2,b1,b2) {
  { h$ret1 = (a2 ^ b2); return (a1 ^ b1); };
}

function h$hs_and64(a1,a2,b1,b2) {
  { h$ret1 = (a2 & b2); return (a1 & b1); };
}

function h$hs_or64(a1,a2,b1,b2) {
  { h$ret1 = (a2 | b2); return (a1 | b1); };
}

function h$hs_eqInt64(a1,a2,b1,b2) {
  return (a1 === b1 && a2 === b2) ? 1 : 0;
}

function h$hs_neInt64(a1,a2,b1,b2) {
  return (a1 !== b1 || a2 !== b2) ? 1 : 0;
}

function h$hs_leInt64(a1,a2,b1,b2) {
  if(a1 === b1) {
    var a2s = a2 >>> 1;
    var b2s = b2 >>> 1;
    return (a2s < b2s || (a2s === b2s && ((a2&1) <= (b2&1)))) ? 1 : 0;
  } else {
    return (a1 < b1) ? 1 : 0;
  }
}

function h$hs_ltInt64(a1,a2,b1,b2) {
  if(a1 === b1) {
    var a2s = a2 >>> 1;
    var b2s = b2 >>> 1;
    return (a2s < b2s || (a2s === b2s && ((a2&1) < (b2&1)))) ? 1 : 0;
  } else {
    return (a1 < b1) ? 1 : 0;
  }
}

function h$hs_geInt64(a1,a2,b1,b2) {
  if(a1 === b1) {
    var a2s = a2 >>> 1;
    var b2s = b2 >>> 1;
    return (a2s > b2s || (a2s === b2s && ((a2&1) >= (b2&1)))) ? 1 : 0;
  } else {
    return (a1 > b1) ? 1 : 0;
  }
}

function h$hs_gtInt64(a1,a2,b1,b2) {
  if(a1 === b1) {
    var a2s = a2 >>> 1;
    var b2s = b2 >>> 1;
    return (a2s > b2s || (a2s === b2s && ((a2&1) > (b2&1)))) ? 1 : 0;
  } else {
    return (a1 > b1) ? 1 : 0;
  }
}

function h$hs_quotWord64(a1,a2,b1,b2) {
  // var a = h$ghcjsbn_mkBigNat_ww(a1,a2); // bigFromWord64(a1,a2);
  // var b = h$ghcjsbn_mkBigNat_ww(b1,b2); // bigFromWord64(b1,b2);
  var q = h$ghcjsbn_quot_bb(h$ghcjsbn_mkBigNat_ww(a1,a2),
                            h$ghcjsbn_mkBigNat_ww(b1,b2));
  return h$ghcjsbn_toWord64_b(q); // this should return the tuple
  //RETURN_UBX_TUP2(h$ghcjsbn_toWord_b(h$ghcjsbn_shr_b(q, 32))
  //  a.divide(b);
  // RETURN_UBX_TUP2(c.shiftRight(32).intValue(), c.intValue());
}

function h$hs_timesInt64(a1,a2,b1,b2) {
  var c = goog.math.Long.fromBits(a2,a1).multiply(goog.math.Long.fromBits(b2,b1));
  { h$ret1 = (c.getLowBits()); return (c.getHighBits()); };
}

function h$hs_quotInt64(a1,a2,b1,b2) {
  var c = goog.math.Long.fromBits(a2,a1).div(goog.math.Long.fromBits(b2,b1));
  { h$ret1 = (c.getLowBits()); return (c.getHighBits()); };
}

function h$hs_remInt64(a1,a2,b1,b2) {
  var c = goog.math.Long.fromBits(a2,a1).modulo(goog.math.Long.fromBits(b2,b1));
  { h$ret1 = (c.getLowBits()); return (c.getHighBits()); };
}

function h$hs_plusInt64(a1,a2,b1,b2) {
  var c = goog.math.Long.fromBits(a2,a1).add(goog.math.Long.fromBits(b2,b1));
  { h$ret1 = (c.getLowBits()); return (c.getHighBits()); };
}

function h$hs_minusInt64(a1,a2,b1,b2) {
  var c = goog.math.Long.fromBits(a2,a1).subtract(goog.math.Long.fromBits(b2,b1));
  { h$ret1 = (c.getLowBits()); return (c.getHighBits()); };
}

function h$hs_leWord64(a1,a2,b1,b2) {
  if(a1 === b1) {
    var a2s = a2 >>> 1;
    var b2s = b2 >>> 1;
    return (a2s < b2s || (a2s === b2s && ((a2&1) <= (b2&1)))) ? 1 : 0;
  } else {
    var a1s = a1 >>> 1;
    var b1s = b1 >>> 1;
    return (a1s < b1s || (a1s === b1s && ((a1&1) <= (b1&1)))) ? 1 : 0;
  }
}

function h$hs_ltWord64(a1,a2,b1,b2) {
  if(a1 === b1) {
    var a2s = a2 >>> 1;
    var b2s = b2 >>> 1;
    return (a2s < b2s || (a2s === b2s && ((a2&1) < (b2&1)))) ? 1 : 0;
  } else {
    var a1s = a1 >>> 1;
    var b1s = b1 >>> 1;
    return (a1s < b1s || (a1s === b1s && ((a1&1) < (b1&1)))) ? 1 : 0;
  }
}

function h$hs_geWord64(a1,a2,b1,b2) {
  if(a1 === b1) {
    var a2s = a2 >>> 1;
    var b2s = b2 >>> 1;
    return (a2s > b2s || (a2s === b2s && ((a2&1) >= (b2&1)))) ? 1 : 0;
  } else {
    var a1s = a1 >>> 1;
    var b1s = b1 >>> 1;
    return (a1s > b1s || (a1s === b1s && ((a1&1) >= (b1&1)))) ? 1 : 0;
  }
}

function h$hs_gtWord64(a1,a2,b1,b2) {
  if(a1 === b1) {
    var a2s = a2 >>> 1;
    var b2s = b2 >>> 1;
    return (a2s > b2s || (a2s === b2s && ((a2&1) > (b2&1)))) ? 1 : 0;
  } else {
    var a1s = a1 >>> 1;
    var b1s = b1 >>> 1;
    return (a1s > b1s || (a1s === b1s && ((a1&1) > (b1&1)))) ? 1 : 0;
  }
}

function h$hs_remWord64(a1,a2,b1,b2) {
  /* var a = h$bigFromWord64(a1,a2);
     var b = h$bigFromWord64(b1,b2);
     var c = a.mod(b); */
  var r = h$ghcjsbn_rem_bb(h$ghcjsbn_mkBigNat_ww(a1,a2)
                           ,h$ghcjsbn_mkBigNat_ww(b1,b2));
  return h$ghcjsbn_toWord64_b(r);
  // RETURN_UBX_TUP2(c.shiftRight(32).intValue(), c.intValue());
}

function h$hs_uncheckedIShiftL64(a1,a2,n) {
                                                                 ;
  var num = new goog.math.Long(a2,a1).shiftLeft(n);
                                                                                           ;
  { h$ret1 = (num.getLowBits()); return (num.getHighBits()); };
}

function h$hs_uncheckedIShiftRA64(a1,a2,n) {
                                                                 ;
  var num = new goog.math.Long(a2,a1).shiftRight(n);
  { h$ret1 = (num.getLowBits()); return (num.getHighBits()); };
}

// always nonnegative n?
function h$hs_uncheckedShiftL64(a1,a2,n) {
                                                                ;
  n &= 63;
                                            ;
  if(n == 0) {
                                            ;
    { h$ret1 = (a2); return (a1); };
  } else if(n < 32) {
                                            ;
    { h$ret1 = (a2 << n); return ((a1 << n) | (a2 >>> (32-n))); };
  } else {
                                                                              ;
    { h$ret1 = (0); return (((a2 << (n-32))|0)); };
  }
}

function h$hs_uncheckedShiftRL64(a1,a2,n) {
                                                                 ;
  n &= 63;
  if(n == 0) {
    { h$ret1 = (a2); return (a1); };
  } else if(n < 32) {
    { h$ret1 = ((a2 >>> n ) | (a1 << (32-n))); return (a1 >>> n); };
  } else {
    { h$ret1 = ((a1 >>> (n-32))|0); return (0); };
  }
}

// fixme this function appears to deoptimize a lot due to smallint overflows
function h$imul_shim(a, b) {
    var ah = (a >>> 16) & 0xffff;
    var al = a & 0xffff;
    var bh = (b >>> 16) & 0xffff;
    var bl = b & 0xffff;
    // the shift by 0 fixes the sign on the high part
    // the final |0 converts the unsigned value into a signed value
    return (((al * bl)|0) + (((ah * bl + al * bh) << 16) >>> 0)|0);
}

var h$mulInt32 = Math.imul ? Math.imul : h$imul_shim;

// function h$mulInt32(a,b) {
//  return goog.math.Long.fromInt(a).multiply(goog.math.Long.fromInt(b)).getLowBits();
// }
// var hs_mulInt32 = h$mulInt32;

function h$mulWord32(a,b) {
  return goog.math.Long.fromBits(a,0).multiply(goog.math.Long.fromBits(b,0)).getLowBits();
}

function h$mul2Word32(a,b) {
  var c = goog.math.Long.fromBits(a,0).multiply(goog.math.Long.fromBits(b,0));
  { h$ret1 = (c.getLowBits()); return (c.getHighBits()); };
}

function h$quotWord32(a,b) {
  return goog.math.Long.fromBits(a,0).div(goog.math.Long.fromBits(b,0)).getLowBits();
}

function h$remWord32(a,b) {
  return goog.math.Long.fromBits(a,0).modulo(goog.math.Long.fromBits(b,0)).getLowBits();
}

function h$quotRem2Word32(a1,a2,b) {
/*  var a = h$bigFromWord64(a1,a2);
  var b = h$bigFromWord(b);
 var d = a.divide(b); */
  /* var a = h$ghcjsbn_mkBigNat_ww(a1,a2);
  var b = h$ghcjsbn_mkBigNat_w(b); */
  var q = [], r = [];
  h$ghcjsbn_quotRem_bb(q,r,h$ghcjsbn_mkBigNat_ww(a1,a2),h$ghcjsbn_mkBigNat_w(b));
  { h$ret1 = (h$ghcjsbn_toWord_b(r)); return (h$ghcjsbn_toWord_b(q)); };
  // RETURN_UBX_TUP2(d.intValue(), a.subtract(b.multiply(d)).intValue());
}

function h$wordAdd2(a,b) {
  var c = goog.math.Long.fromBits(a,0).add(goog.math.Long.fromBits(b,0));
  { h$ret1 = (c.getLowBits()); return (c.getHighBits()); };
}

// this does an unsigned shift, is that ok?
function h$uncheckedShiftRL64(a1,a2,n) {
  if(n < 0) throw "unexpected right shift";
  n &= 63;
  if(n == 0) {
    { h$ret1 = (a2); return (a1); };
  } else if(n < 32) {
    { h$ret1 = ((a2 >>> n) | (a1 << (32 - n))); return ((a1 >>> n)); };
  } else {
    { h$ret1 = ((a2 >>> (n - 32))|0); return (0); };
  }
}

function h$isDoubleNegativeZero(d) {
                                           ;
  return (d===0 && (1/d) === -Infinity) ? 1 : 0;
}

function h$isFloatNegativeZero(d) {
                                          ;
  return (d===0 && (1/d) === -Infinity) ? 1 : 0;
}

function h$isDoubleInfinite(d) {
  return (d === Number.NEGATIVE_INFINITY || d === Number.POSITIVE_INFINITY) ? 1 : 0;
}

function h$isFloatInfinite(d) {
  return (d === Number.NEGATIVE_INFINITY || d === Number.POSITIVE_INFINITY) ? 1 : 0;
}

function h$isFloatFinite(d) {
  return (d !== Number.NEGATIVE_INFINITY && d !== Number.POSITIVE_INFINITY && !isNaN(d)) ? 1 : 0;
}

function h$isDoubleFinite(d) {
  return (d !== Number.NEGATIVE_INFINITY && d !== Number.POSITIVE_INFINITY && !isNaN(d)) ? 1 : 0;
}

function h$isDoubleNaN(d) {
  return (isNaN(d)) ? 1 : 0;
}

function h$isFloatNaN(d) {
  return (isNaN(d)) ? 1 : 0;
}

function h$isDoubleDenormalized(d) {
  return (d !== 0 && Math.abs(d) < 2.2250738585072014e-308) ? 1 : 0;
}

function h$isFloatDenormalized(d) {
  return (d !== 0 && Math.abs(d) < 2.2250738585072014e-308) ? 1 : 0;
}

var h$convertBuffer = new ArrayBuffer(8);
var h$convertDouble = new Float64Array(h$convertBuffer);
var h$convertFloat = new Float32Array(h$convertBuffer);
var h$convertInt = new Int32Array(h$convertBuffer);

// use direct inspection through typed array for decoding floating point numbers if this test gives
// the expected answer. fixme: does this test catch all non-ieee or weird endianness situations?
h$convertFloat[0] = 0.75;
// h$convertFloat[0] = 1/0; // to force using fallbacks
var h$decodeFloatInt = h$convertInt[0] === 1061158912 ? h$decodeFloatIntArray : h$decodeFloatIntFallback;
var h$decodeDouble2Int = h$convertInt[0] === 1061158912 ? h$decodeDouble2IntArray : h$decodeDouble2IntFallback;

function h$decodeFloatIntArray(d) {
                                            ;
    if(isNaN(d)) {
        { h$ret1 = (105); return (-12582912); };
    }
    h$convertFloat[0] = d;
    var i = h$convertInt[0];
    var exp = (i >> 23) & 0xff;
    var sgn = 2 * (i >> 31) + 1;
    var s = i&8388607;
    if(exp === 0) { // zero or denormal
        if(s === 0) {
                                                        ;
            { h$ret1 = (0); return (0); };
        } else {
            h$convertFloat[0] = d*8388608;
            i = h$convertInt[0];
                                                                                                                 ;
            { h$ret1 = (((i&2139095040) >> 23) - 173); return (sgn*(i&8388607)); }
        }
    } else {
                                                                                        ;
      { h$ret1 = (exp - 150); return (sgn * (s|8388608)); };
    }
}

function h$decodeFloatIntFallback(d) {
                                               ;
    if(isNaN(d)) {
      { h$ret1 = (105); return (-12582912); };
    }
    var ret0, ret1;
    { (ret0) = (h$integer_cmm_decodeDoublezhFallback(d)); (ret1) = h$ret1; };
    var exponent = ret0 + 29;
    var significand = ret1.shiftRight(28).add(h$bigOne).shiftRight(1).intValue();
    if(exponent > 105) {
      exponent = 105;
      significand = d > 0 ? 8388608 : -8388608;
    } else if(exponent < -151 || significand === 0) {
      significand = 0;
      exponent = 0;
    }
                                                                               ;
    { h$ret1 = (exponent); return (significand); };
}

function h$decodeDouble2IntArray(d) {
                                              ;
    if(isNaN(d)) {
 { h$ret1 = (-1572864); h$ret2 = (0); h$ret3 = (972); return (1); };
    }
    h$convertDouble[0] = d;
                                                                                                                 ;
    var i1 = h$convertInt[1];
    var ret1, ret2 = h$convertInt[0], ret3;
    var exp = (i1&2146435072)>>>20;
  if(exp === 0) { // denormal or zero
    if((i1&2147483647) === 0 && ret2 === 0) {
      ret1 = 0;
      ret3 = 0;
    } else {
      h$convertDouble[0] = d*9007199254740992;
      i1 = h$convertInt[1];
      ret1 = (i1&1048575)|1048576;
      ret2 = h$convertInt[0];
      ret3 = ((i1&2146435072)>>>20)-1128;
    }
  } else {
    ret3 = exp-1075;
    ret1 = (i1&1048575)|1048576;
  }
                                                                                             ;
    { h$ret1 = (ret1); h$ret2 = (ret2); h$ret3 = (ret3); return (i1<0?-1:1); };
}

function h$decodeDouble2IntFallback(d) {
                                                 ;
    if(isNaN(d)) {
 { h$ret1 = (-1572864); h$ret2 = (0); h$ret3 = (972); return (1); };
    }
    var exponent, significand;
    { (exponent) = (h$integer_cmm_decodeDoublezhFallback(d)); (significand) = h$ret1; };
    var sign = d<0?-1:1;
    var s = significand.abs();
    var ret1 = s.shiftRight(32).intValue();
    var ret2 = s.intValue();
    var ret3 = exponent;
                                                                                                ;
    { h$ret1 = (ret1); h$ret2 = (ret2); h$ret3 = (ret3); return (sign); };
}

// round .5 to nearest even number
function h$rintDouble(a) {
  var rounda = Math.round(a);
  if(a >= 0) {
    if(a%1===0.5 && rounda%2===1) { // tie
      return rounda-1;
    } else {
      return rounda;
    }
  } else {
    if(a%1===-0.5 && rounda%2===-1) { // tie
      return rounda-1;
    } else {
      return rounda;
    }
  }
}
var h$rintFloat = h$rintDouble;

function h$acos(d) { return Math.acos(d); }
function h$acosf(f) { return Math.acos(f); }

function h$asin(d) { return Math.asin(d); }
function h$asinf(f) { return Math.asin(f); }

function h$atan(d) { return Math.atan(d); }
function h$atanf(f) { return Math.atan(f); }

function h$atan2(x,y) { return Math.atan2(x,y); }
function h$atan2f(x,y) { return Math.atan2(x,y); }

function h$cos(d) { return Math.cos(d); }
function h$cosf(f) { return Math.cos(f); }

function h$sin(d) { return Math.sin(d); }
function h$sinf(f) { return Math.sin(f); }

function h$tan(d) { return Math.tan(d); }
function h$tanf(f) { return Math.tan(f); }

function h$cosh(d) { return (Math.exp(d)+Math.exp(-d))/2; }
function h$coshf(f) { return h$cosh(f); }

function h$sinh(d) { return (Math.exp(d)-Math.exp(-d))/2; }
function h$sinhf(f) { return h$sinh(f); }

function h$tanh(d) { return (Math.exp(2*d)-1)/(Math.exp(2*d)+1); }
function h$tanhf(f) { return h$tanh(f); }

var h$popCntTab =
   [0,1,1,2,1,2,2,3,1,2,2,3,2,3,3,4,1,2,2,3,2,3,3,4,2,3,3,4,3,4,4,5,
    1,2,2,3,2,3,3,4,2,3,3,4,3,4,4,5,2,3,3,4,3,4,4,5,3,4,4,5,4,5,5,6,
    1,2,2,3,2,3,3,4,2,3,3,4,3,4,4,5,2,3,3,4,3,4,4,5,3,4,4,5,4,5,5,6,
    2,3,3,4,3,4,4,5,3,4,4,5,4,5,5,6,3,4,4,5,4,5,5,6,4,5,5,6,5,6,6,7,
    1,2,2,3,2,3,3,4,2,3,3,4,3,4,4,5,2,3,3,4,3,4,4,5,3,4,4,5,4,5,5,6,
    2,3,3,4,3,4,4,5,3,4,4,5,4,5,5,6,3,4,4,5,4,5,5,6,4,5,5,6,5,6,6,7,
    2,3,3,4,3,4,4,5,3,4,4,5,4,5,5,6,3,4,4,5,4,5,5,6,4,5,5,6,5,6,6,7,
    3,4,4,5,4,5,5,6,4,5,5,6,5,6,6,7,4,5,5,6,5,6,6,7,5,6,6,7,6,7,7,8];

function h$popCnt32(x) {
   return h$popCntTab[x&0xFF] +
          h$popCntTab[(x>>>8)&0xFF] +
          h$popCntTab[(x>>>16)&0xFF] +
          h$popCntTab[(x>>>24)&0xFF];
}

function h$popCnt64(x1,x2) {
   return h$popCntTab[x1&0xFF] +
          h$popCntTab[(x1>>>8)&0xFF] +
          h$popCntTab[(x1>>>16)&0xFF] +
          h$popCntTab[(x1>>>24)&0xFF] +
          h$popCntTab[x2&0xFF] +
          h$popCntTab[(x2>>>8)&0xFF] +
          h$popCntTab[(x2>>>16)&0xFF] +
          h$popCntTab[(x2>>>24)&0xFF];
}

function h$bswap64(x1,x2) {
  { h$ret1 = ((x1 >>> 24) | (x1 << 24) | ((x1 & 0xFF00) << 8) | ((x1 & 0xFF0000) >> 8)); return ((x2 >>> 24) | (x2 << 24) | ((x2 & 0xFF00) << 8) | ((x2 & 0xFF0000) >> 8)); };

}

var h$clz32 = Math.clz32 || function(x) {
    if (x < 0) return 0;
    if (x === 0) return 32;
    return 31 - ((Math.log(x) / Math.LN2) | 0);
}
function h$clz8(x) {
    return h$clz32(x&255)-24;
}
function h$clz16(x) {
    return h$clz32(x&65535)-16;
}

function h$clz64(x1,x2) {
    return (x1 === 0) ? 32 + h$clz32(x2) : h$clz32(x1);
}

var h$ctz32tbl = [32,0,1,26,2,23,27,0,3,16,24,30,28,11,0,13,4,7,17,0,25,22,31,15,29,10,12,6,0,21,14,9,5,20,8,19,18,0,0,0,0,0,31];
function h$ctz32(x) {
    return h$ctz32tbl[((x&-x)%37)&63];
}
function h$ctz16(x) {
    return h$ctz32(x|65536);
}
function h$ctz8(x) {
    return h$ctz32(x|256);
}
function h$ctz64(x1,x2) {
    return (x2 === 0) ? 32 + h$ctz32(x1) : h$ctz32(x2);
}

var h$fround = null;
var h$truncateFloat_buf = null;
if(typeof Math.fround === 'function') {
  h$fround = function(f) {
                                        ;
    return Math.fround(f);
  }
} else {
  h$fround = function(f) {
                                        ;
    if(!h$truncateFloat_buf) h$truncateFloat_buf = new Float32Array(1);
    h$truncateFloat_buf[0] = f;
    return h$truncateFloat_buf[0];
  }
}
// Unicode tables generated by ghcjs/utils/genUnicode.hs
var h$printRanges = "f|!-f=|/q'/+1$J|(mo'1q&')| 63Y--EO'|$9| ('| ?'|!9?| ?-| %'AZ'| JI| +|#U2'''O0$)+'5'''+3*','O-).+''O0&&&'$-+''))0+$1C9)4(N0&,'7(('@+';A)2'''O0&,'5''')3'+','G7'.))*)'$&)')));+-))*'.>M-+2(PB)3(*1'&/+'733(2(P6,'5(*1'1$+'7&?)2(u'3(,32+'C)1''F)S4$'1)*/$2/7');| =+^n'$''$'.+0( #''<('-$.'7'+d| Yk+rk@<n|$G$-&|(E*'1$*'v*'f*'1$*'A| :*'| O'd)W/| t9|.r)|! 1=09Q5K;=(&;|!+'7/7/?'7/| z3z-| U7b:+;+(x'-9|  +W/9)| E'| K]'9/7/?'A| K| b+| #)|!W3| A)A)| /| I33r&/|%M/|&;'/'p'/'3 $a'| 3@>'/H')48-S1| +C''Y<)`GfA|#)/|-h-rU9M|H;'d'h);2| %| '| &|#<-| #$-&| 91'?S510000000|!4| CW| {;|$hW;+| I| u'|!=-v)|!+y-l;| '|$y} ^y7}%0j| /|9t)| 75|'fK|!+| {3|#3_''| S| 3+7/| 93| S5;/[+| r9`)| f8+f| 65?'7'|!=S[7/'/'/510| (+'|!#| %'7/}!e;;Q+| +}!'n|(/'|!Cp1;--W,$&&|!gE|(-C| I'| 5t?'W/?'jH*+-|#!+|$7)/'/'/'))10='';VH&@'?h|!f-)+| #)| v);+| &| %|!t^)| +A[+l;Y-z-`m+?x|#Q'7| vt3| 19|#4|&v5O73|#E/'$|  &)&Q| X35| j[)Y-| H| 9/'| I+&-3(X+)+5351| Idr+;5| 5)^'Y-W1+;1| j| [|+tb|(U| f+`A| E*?U17/| 3>;r5| [+&9/K9Gy|!S| ?-71)2'''O0&,'5''')5,1'1)-|%x| Y37|#b| 5'G| 5| S97p| 937|*K| p;|)y| ;|<Y|4M|!=|!M,|b`|7l}#8j|,^1b6+'|!/`'/7| U770L-I|3U| S9| 'CE}$&7'|e7|!E-=)517'+} 47|%M7r'| ^3|!5h| U|$/| x5G|#1| t| V&'&''+:$0| J*'30Z*,$)1|'T'|&O'| -}  %|$E'C|=C+X&$'$7* #/* $)&$' &'$'+0**$6D-),D| 1'|&#|  +|!7;A'A@m7=)b| @+z| `^=z-51'|#r| #)| f'| h-l3|%`| _-xu|#P'|#+C=)+;|!W;| tz;+| 937/t3`|I^}*Q/v} !59|$x}$#I|,'|G1|%A";
var h$alnumRanges = "| +71W/W| '0'$)'(Pa|*2+;?-1$D|!Y&'+$/$)$J| o|#*|#oo'0r5| #$&&$3Y-)^9-| ^+|!;2'7H'B| ?'|!9?| 5+,| %G[| QI| +|!p'7H2'''O0$)+'5'''+3*',';'/1).+''O0&&&'$-+''))0+$1C9)4(N0&,'7(('@+'7E)2'''O0&,'5''')3'+','707'.))*)'$&)')));+-))*'.>==+2(PB)3(*1'&/+'731')2(P6,'5(*1'1$+'7&?)2(u'3(,32+'C+/''F)S4$'1)*/$2/7''=| =-A6r'$''$'.+0( #''<('-$.'7'+dP'/K $+7k+KFk5| :| ^/| f'p$-&z|'F*'1$*'v*'f*'1$*'A| :*'| O')5K)CC| t;|-j'EV-| `)91=09M9K;=(&;| r)*''7/7E)'7/| z3z-| U7b:+;7t'-9|  +W/9n[+| G]'9/7=2A| K| b+7E5;|!W;| 937)| +| n)i&/|%M/|&;'/'p'/'3 $a'| 30$))0)+'/+=-)0|!U''/-9/=| /fE*&7$)-/ $+8'+--+$| =|0/| A| fO|.#`|91| '| &|!y/55&p$-&| 91@S510000000c| '|*H)UA,'-+| v''')|!!*-v)|!+)+7Y| 3Cd7`3@d7rA|'-} X;| ^}%/C| /|9t| O| %'|& )[K| /6a| on5'|!='+_''| S| +3/7| 1;| S97/S)*| %'l;^)| K?9/b| 65?'7/Q)| [S)'C'-7/'/'/510y*+'|!#z&'7/}!e;;Q+| +}!'n|(/'|!Cp1;--;<,$&&|!Ff|()G| I'| 5t;+CC?| M-|#!I71W/W9|! )/'/'/')j;VH&@'?h|!f;| #;| ;E'|!Q|!s^)| +A[+l;Y-z-`'l+3,x|#Q'7| vt3| 1|#M|&v5O73|#E/'$|  &)&Q'b'p35| j[+W| U| 9/'| I+&-3(X+)+5Sbcd3_+-C| 57O'Y-WQ1| j| [|+tb|(U| W9`A| AMU17/| 36Cl'4| S99/K9Gm|!`| ?-71)2'''O0&,'5''')5,1'1)-|%x| U$37|#b| 5'5| G| K)87p| 937|*K| p;|)y| ;|<Y|4M|!=|!M|bl|7l}#8j|,^1b6|!;`'-9| 75+;70L-I|3U| S9| 'CE}$&7'|e7|!E-=)517)'} <3-)/33'1`+|#=)|&=G|#1| t| V&'&''+:$0| J*'30Z*,$)1|'T'UTaTaTaTaT2'| -}  %|$E'C|=C+X&$'$7* #/* $)&$' &'$'+0**$6D-),D|,t=|v'}*Q/v} !59|$x}$#I|,'|G1|%A";
var h$lowerRanges = "|!3W| =uS2 <& (& 8' #)'$&('+&()'& #&$'$'($&'')/&& )' )&'$( >1'&'$+ %| SX|$=$(()GXj&)) ,,$'&'| /| ) 25 ;& '' Q| +r} KQ|  | G=g|!; l5 Q43/73333/73333?'333333-&/()&3+''337)&|&+(')X**&'3++| 2|]a| ''(' $+$'.- R'1$*:p$-}'Zi 7H .|#! ') @2 #' %*$&$) +| j|28z5'}%!p1;-|7`W|;?t} :;d}+l-WW1FWWW+$08WWWWWWWWWWWWWWWWW[[U.WU.WU.WU.WU.$";
var h$upperRanges = "| MW|!9Q0f <& (& 8' #)'$&('+&()'& #&$'$'($&)0'&& )' )&'$( >1'&'$+ %|&I$(2.$)$&D4j&)) ,,&$''| /| ) 14 <' '' P&p|a5p$-|l( l4 Q433/73333/9 $23S333333-9-9+;-9-|%l*()')'(-/ $+'+7'-| B|[]| '| +$)' $+$'2) R3$*}']( 7H .|#! '( ?6 #' %+$&$( ++''}%OGW|;/t} :Kd}+l9WWWWWW$''&''+2WWW'*'30Y'*,$)1YWWWWWWWWWWW`UfUfUfUfUf%";
var h$alphaRanges = "| MW/W| '6*,Qa|*2+;?-1$|!q-&'+$/$)$J| o|#*3|#bo'0r| YY-)| #zj'|!4$A'1'7)'B$`^|! 9Rf5'+,O+4(PU| WI| l| 5)F07AC+3'''O0$)+)B<'(?'I/+''O0&&&b+$I)C5(N0&,)F@'j3'''O0&,)_'(AD$/))*)'$&)')));O| 03(PB)V'/'j3(P6,)c$'A'G3(u'BD'S/-G)S4$'1| =| )&;1| ='$''$'.+0( #''*&5&-$M+d| F3kY-|!UzKB/++)('1)+=;Dp$-&z|'F*'1$*'v*'f*'1$*'A| :*'| OnCC| t;|-j'EV-| `/31=*?G?G?=(A| 1j*| N| z3v$-| U7b| +`'-9|  M1| 9Q5| 3| n|!(| 'E1| 7`='7|  Wlv)7l|!E+*)'5|$;| I|&3'/'p'/'3 $a'| 30$))0)+'/+=-)0|!W<B=|!9*&7$)-/ $+8'+--+| 0'|[[| '| &|!y/+)';p$-&| 91BQ510000000| j|*H'x--'+| v/)|!!*-v)|!+EY| 3C|+E} X;| ^}%/C| /|9t| O| %'|& )C7'K| 'Cb'| U| +5'|!='+_''| S9(*P^| 1?| -| E/)>[7QU^1| '[B-67-uQ)2KQ)(| -$)''-'$R)'91);/'/'/510y*+'|!#j^}!e;;Q+| +}!'n|(/'|!Cp1;--$7<,$&&|!Ff|()G| I'| 5t;|!W-|#!lW/W9|! )/'/'/')j;VH&@'?h|!f|(^^)| +| 'dCE2/p7`'l+3| )|#Q|!3t3| 1|#M|&v5O73|#E/'$|  &)&Q7Q5b|!1O7W| U| 9/'| I@+(X|  ^)^j3ZY| 57O7I=G|!K| [|55| 3| `| #dUWlvj):| )?+MmGT|!x| 'p3'''O0&,)a-|&C| )K'$|$+| '| l| )K| >z|+/| Ib|)y| ;|<Y|4M|gU|7l}#8j|,^1b|!Q`G| )C+bM-I|3U| S9| L=}$&7'|e7|!E-=)517} K-| t| V&'&''+:$0| J*'30Z*,$)1|'T'UTaTaTaTaT2} !3|$E|=h+X&$'$7* #/* $)&$' &'$'+0**$6D-),D} (7}*Q/v} !59|$x}$#I|,'";
var h$toLowerMapping = "| K Wb|!9 Qb!1bf  9#  !|$F  ## &'  (# &'  8#  !|!_# # #)  !|$^# ! # ! |$U !# '|$S&'  !| f|$M !|$O# ! |$S !|$W  !|$`|$[&)  !|$`|$d ! |$f $#  !|$n# ! |$n'  !#  !|$n#!'|$l ##  !|$p#) &1  !%# ! % !#  !%# ) #'  )# &'  !%# ! # ! |!. !| 6# 4 # ! |!q * #1  !}![r# ! |#X}%=]'  !#  !|$>| Q !| U# % #|&I  !# &) &3 |%0/  !n )l ! | G!'| E!Eb!5bj B3  ,# &- |!]'  !#  !.#' )|!qC| hdb| )  1# &5  <#  !?# ' #'  P# &' p| '|a5 p} hG ! } hG- }#To|l)  l# &5  !} p4  P# &5 303 /07 303 303 /09  $0 @3 30S 303 303 303 '0'| ZD9 +| sD9 '0'|!4; '0'|!L<9 '|!m'|!iD|&Y }#a()  !}!&:}!#V/ | 8| # CAI &|23 WU|Ht | '| '| +  !#  !}!Zc|ue}%:e'  $#  !}![R}!Zo !}![X}![V ! #' &3 '}!]> R# &3  !# &+ &}'])  7# &I  .# &|##  '# &)  ?# &7  ##  !}(b.# % #+  !# }4p*'  !# &)  +#  !}*H0}*HF !}*H>}*H*'  !}*G&}*GV}%OG Wb|;/ tr} :K db}p?  ";
var h$toUpperMapping = "|!1 Wa| = |A$x Qa!1a !|!`  9!  !|%.  #! $'  (! $'  7! $'  #!  !!|&]|(_'  !! $' $) $- $' |$>)  !!|#Y) |%i'  #! $' $+ $' $)  !! $' $)  !! |!N-  !!$ ! ! !$  !!$ ) ! !| e  )! $'  !!$ ! !)  4! $)  )! $3 $' '}!]? ! !+  %!  !!}![Y !}![S}![W !|$]|$T!'|$R ! |$L ! |$N}4qo)  !|$R}*H? ! |$V ! }*GS !}*H1  !|$Z|$_ ! }!Zd}4q6'  !|$_  !}!Zp|$c' |)N1 }%:g' |)_' |)_)  !}*GW|$m|#&'|$k|#.- |)c9 }4o.|#b |#ez  !! $) $) )|!r| % | _)k!Ea| B5a|!m'| D ! | B|!P)  !| $| 2 !0  ,!  !!| s !| g/ !|!T |$8' $' $| 1 daC| g 2 !5  ;! $'  '!  !!> Q !| + p| &} N7 }1H>) } pP|!v  l! $- |!X-  P! $313 /17 313 313 /19  $1 B3 313 '| [+| t'|!5'|!n'|!M'|!j' 313 313 313 '1 ! 37 }#R4+ F; '1? '1) >= F|'b | 6f C@+ $|2f WT|IE | '| &' $)  !}![q}![k $ !/ $' $7  R! $3  !! $+ $; p} hF ! } hF- }#Tm}'Zj  7! $I  .! $|##  '! $)  ?! $7  !! $'  %! $+ $+  !! $)  *! $}%P= Wa|;? tq} :; da}p>; ";
var h$toTitleMapping = "|!1 Wa| = |A$x Qa!1a !|!`  9!  !|%.  #! $'  (! $'  7! $'  #!  !!|&]|(_'  !! $' $) $- $' |$>)  !!|#Y) |%i'  #! $' $+ $' $)  !! $' $)  !! |!N+  !#  !!# ! ! !#  )!  !!| e * ! ! # # !)  4! $)  )! $3 $' '}!]? ! !+  %!  !!}![Y !}![S}![W !|$]|$T!'|$R ! |$L ! |$N}4qo)  !|$R}*H? ! |$V ! }*GS !}*H1  !|$Z|$_ ! }!Zd}4q6'  !|$_  !}!Zp|$c' |)N1 }%:g' |)_' |)_)  !}*GW|$m|#&'|$k|#.- |)c9 }4o.|#b |#ez  !! $) $) )|!r| % | _)k!Ea| B5a|!m'| D ! | B|!P)  !| $| 2 !0  ,!  !!| s !| g/ !|!T |$8' $' $| 1 daC| g 2 !5  ;! $'  '!  !!> Q !| + p| &} N7 }1H>) } pP|!v  l! $- |!X-  P! $313 /17 313 313 /19  $1 B3 313 '| [+| t'|!5'|!n'|!M'|!j' 313 313 313 '1 ! 37 }#R4+ F; '1? '1) >= F|'b | 6f C@+ $|2f WT|IE | '| &' $)  !}![q}![k $ !/ $' $7  R! $3  !! $+ $; p} hF ! } hF- }#Tm}'Zj  7! $I  .! $|##  '! $)  ?! $7  !! $'  %! $+ $+  !! $)  *! $}%P= Wa|;? tq} :; da}p>; ";
var h$catMapping = "d;P)3J)3 !/0 !34 !3.'37*'3)4'3W! !/3 !06 !-6W# !/4 !04f; !83+5 !73 !67 !&1 !4< !76 !74', !6#'3 !6, !&2),FQ!H1!S#H3# <!#$'# (!#$'# 8!#'! ##!)#'! !#!&'!&)!'#+!&'!&)!)#'!&'! ##!&'! !#!'# !!#'!&)! !#!&'!'# !&!)#+& !!$ !#! !$# !!$ )#!'# )!#$'# !!$ !#!&)! >#!1#'!&'!'# !!#+! %#!| S#,Y#G%+6;%?6-%16 !%6*E6|!O' #!# !%6 !!#' *)# !3!+ '6 !!3)! ! !!'!&E!!5!j#$'#)!)# ,!#$-# !!# !4!&'!'#| /!| )# 2!#N-'') <!#'! '#!'# Q!#!p!' */3!r# ! 3<' '7 !5 | #' !.'F''F'' !3'3 Y&- )&'39 /<)4'3J'3'79' !3<!'3d&*7&M'7*+3'&.|!5& !3&1' !<7/''%''N+''&7*)&'7,?3 ! < !&'`&Y'' |! &9',? 7*f&5''%N)3*- O&+'*5'*)'*-'' A3!U&)'' F| K I&| + b'0| 5& !'( !'&)(3'+(.'(,1'7&'''37* !3%A&.'(!3&' '&' O&!1& ! &) +&'  !'&)(+'' '(' '( !'&3 0+ '&!)&''' 7*'&'5/, !75- '' !( /&+ '&' O&!1&!'&!'&!'&'  !' )(''+ ''' )') .1 +& ! &1 7*'')&.9 '' !( 5&!)&!O&!1&!'&!-&'  !'&)(-'!'' !( '(.' ,A '&''' 7* !35A .'(!3&' '&' O&!1&!'&!-&'  !'& !('0+'' '(' '(.3  !'(+ '&!)&''' 7* !7&/,7  !'&!/&) )&!+&) '& ! &!'&) '&) )&) ;&+ '(.'() )(!)(.' ,/ 0? 7*),/7 !57- .)(!3&!)&!Q&!C&) ,)'+(!)'!+'1 ''!'&/ '&''' 7*3 1, !7 .'(!3&!)&!Q&!7&!-&'  !'& !('-( ! ''(!'(''1 '(1  !& '&''' 7*!'&? .'(!3&!)&!v&' ,)(+'!)(!)( !'&3 03 '&''' 7*/,) N/&' '(!G&) S&!5& ! &' 1&) .+ )()' ! '!3(/ 7*' '(F; | )&.'&1'+ J/&*3'F7*'3n '& ! &' '& ! &' ,/ +&!1&!)& # &' '&!+&.'&/'!'',' -& ! %!/'' 7*' +&d ,)7A3 !73)7''/77*7, $7' #/0'(3&!l&+ ?'0-'F''-&9'!l'!37./7!'7-3+7'3n z&'(+'0/'0'''('',7*/3/&'(''+&)',)('&1()&+'=&.'(''/( !'&07*)(.'7p! ! !- $' z& !3%|'E&!+&' 1& ! &!+&' v&!+&' f&!+&' 1& ! &!+&' A&!| ;&!+&' | O&' )'53K,) C&77/ | t&9 <|-j&'3E&PW& !/0) | `&)3)+3&1 =&!+&)'9 G&)''35 G&''; =&!)&!''; | 1&''01'3(.'(9')3*)3 !5&.' 7*/ 7,/ /3<+3)' !< 7*/ j&*| 1&3 v& !'&- | U&7 b&!)'+('')(+ '(./()'+ N) '37*`&' -&9 |  &+ E(1&'(/ 7*8) h7Q&'''(.' '3| 3& !('01' ! ' !(''(3'/(7'' .7*/ 7*/ 13*/3' ?'2| K +'0| '& !'(-' !('-(.'(1&+ 7*13775'57) ''0`&0+''(''0)''&7*|  & !'('')( !'()''(3 +3l&3(3''('') -37*) )&7*`&/%'3| I 333 )'F='01'+&.+&'(.'&!''/ |  #| G%=#*h#n%| 5'/ +' l!#$5# Q!#$5#3!/#' /!' 3#3!3#3!/#' /!' 3# % !3#3!?#' 3#3$3#3$3#3$-#!'#+! !$6&)6)#!'#+!()6+#' '#+!!)63#-!)6' )#!'#+!('6!98-</.'3 !12>'1 !2/B33 !9:-<P53 !12+3'-)3 !4/@93 !43:73P-<!7< !,%' /,)4 !/0*7,)4 !/0!=%) `5G ='+).));'A '7$+7$'7&)!'#)! !#7$'7H-!/7 $!7+! !7#+!&+&&'7'#'!-4$+# !74'7 !#7C,j+ !!#++8/ -4-7'4+7H'7H'7H17Hb7'4'7 !47Hb7|%z437 #/0K7'417 !/0| l7H`7U4t7/4U7- r7U 97M | A,| f7O,|$)7H57H| 5734|!M7H|%Q7 (/0`,|  7-4 !/0b4 &/0C4|%b7|!v4 ,/0| G4 #/0d4 !/0|%f4| )7M4'7/4r7' d7' h7) ;7!37| % | '!!| '# ! !&)!'# $!#+! !#!'#$/#'%)! R#!'#/7 #!#)' !!#- +38'3p# ! #- &' | 9&1  !%3? .Q&5 1&!1&!1&!1&!1&!1&!1&!1&!d''3 #12)3 !12 !31D53<'3 !.3 !12'3 !12 %/0-3*73'.+3 !.3>| C W7!|! 7; |$h7W ;7+ P)3 !7% !&+ &/0'7 %/0 !./'0N5++''(<-%'7)+ !%&F'7!| v&' '''6'% !&.|!#&F)%,- v&) |!+&!'7+,77Y&- l7; C&b7!7,`73,NA,d77,r7A,| G7!|%b7} X;&7 | I7}%/C&| / M&*|9G&) | 775 t&/%'3|%z&*)3C&7*'&K  8!# !&'))F7' !3% /!#'% ! '| U&7+''/33 Q65%'6 '!#$)# @!#*3# #!#'! %#! !#%'6 #!# ! ! !#!)# +!#+!' '!| S ,'%&1&.)&.+&.Q&'(''0+7+ /,'7 !57/ | 1&+33 '(| -&C(.5 '37*/ G'/&)3,+ 7*[&3''3Q&9''(9 F^&) )'0| '&.'(+''(.+(=3 ! %7*+ '3-& !'%5&7*-&!v&/''('''(''5 )&.3& !'(' 7*' +3C&*/&)7 !&( !'(| -& !'&)''&''-&'' !&',S '&*'39&0'''('3,'% !('7 /&' /&' /&5 1&!1&!z#L+%+ '#|!# j&'(.'(.'( !3(.' 7*/ }!e;&; Q&+ | +&+ |MQ=} T7 |(/&' |!C&p 1#; -#-  !&'7&H=&!-& ! &!'&!'&!|!G&C6E |()& !0/C | I&' | 5&t ;& !57' C'13 !/0F/ ?'' F'.'- )/0'3 !/0+3)-)3!+3 !./ #0/@)3 !4.)4 ! 3J'3+ -&!|##&'  !< )3J)3 !/0 !34 !3.'37*'3)4'3W! !/3 !06 !-6W# !/4 !04 !/0 !3/@'37&*| #&'%b&) /&' /&' /&' )&) '5 !46N'5 ! 7+4'77 )<'7' ;&!W&!I&!'&!A&' ?&h |!f&- )3+ | #,) 57| 3++,E7',N) ;7+ N| ' | #7.|!t ^&) | +&A .Y,+ d&+,; E&63&6- p&-'- `& ! 3l&+ 3&F-+x t!t#| f&' 7*| v t&3 | 1&9 F|#5 |&v&5 O&7 3&|#E /&'  !& |  &!'&) ,' Q& ! 33,Q&'71,b&3 5,| j O&/,) FW&- F| I | 9&/ '&| I ,)'!''- +'+&!)&!Y&+ )'+ .3,3 531 ^&',F^&),d 3&N[&''+ -,135 | 5&) 13O&' 3,I&- 3,G&1 +3; 1,| j | [&|+t b,|(U  !('0| 3&A'13+ K,7*A )'0| #&)(+''('''3X+3? U&1 7*/ )'l&-'03'!7*+3; j&.'3,5 ''0| )&)(5''(+&+3+ F' 7*,/ K,9 G&!U&)()''( !'(''/3|!S | '&.)(3'- 7*1 .'(!3&' '&' O&!1&!'&!-&'  !'&'(.+(' '(' )(5 0- -&'(' 1') -'|%x | )&)(/' !('+(''0'''& !3&3 7*|#b | '&)(+'' +(''0''53| 5 | )&)(3''( !'('')3,9 7*p z& !'(.'(/' !('3 7*|*K d!d#7*5,; ,|)z | ;&|<Y |4M&|!= |!M+!-3|b` |7l&}#8j |,^&1 b&!7*+ '3|!/ `&' -'F7 | )&1'-3+7+% !377 7*!1,!M&- I&|3U | S&9 ,| %(C +'=%}$&7 '&|e7 |!E&- =&) 5&1 7&' N''F+<} 4/ |%M77 r7' | A7'()')7/(3<3''71'`7+'| )7h | M7)'N|$/ | x75 G,|#1 W!W#W!1#!G#W!W# !! '!' $' '!' +!!3!+# ! #!1#!9#W!W#'!!+!' 3!!1!!W#'!!+!!-! ! !) 1!!W#W!W#W!W#W!W#W!W#W!W#W![#' U!HU#H/#U!HU#H/#U!HU#H/#U!HU#H/#U!HU#H/# !!#' | -*}  % |$E&' 5,1'|=C +&!Y&!'& ! &'  !& 7&!+& # &/ ,+  $& )&!'& ! &'  && '& ! &' +&!1&!+&!+& ! &!7&!E&- )&!-&!E&| 1 '4|&# |  7+ |!77; A7' A7!A7!n77 =,) b7!| A7+ z7| ` ^7= z7- 571 '7|#r | #7) | f7' | h7- l73 |%`7!| `7- x7!v7!|#Q7' |#+7C =7) +7; |!W7; | t7z ;7+ | 973 77/ t73 `7|I^ }*Q/&v } !5&9 |$x&}$#I |,'&|AO X` |!/<|!p |%A'}PF' ";






// values defined in Gen2.ClosureInfo







// thread status

/*
 * low-level heap object manipulation macros
 */
// GHCJS.Prim.JSVal







// GHCJS.Prim.JSException





// Exception dictionary for JSException


// SomeException






// GHC.Ptr.Ptr






// GHC.Integer.GMP.Internals
// Data.Maybe.Maybe




// #define HS_NOTHING h$nothing






// Data.List
// Data.Text




// Data.Text.Lazy





// black holes
// can we skip the indirection for black holes?






// resumable thunks


// general deconstruction



// retrieve  a numeric value that's possibly stored as an indirection



// generic lazy values
// generic data constructors and selectors
// unboxed tuple returns
// #define RETURN_UBX_TUP1(x) return x;

// encode a string constant
function h$str(s) {
  var enc = null;
  return function() {
    if(enc === null) {
      enc = h$encodeModifiedUtf8(s);
    }
    return enc;
  }
}

// encode a packed string
// since \0 is used to separate strings (and a common occurrence)
// we add the following mapping:
//   - \0  -> \cz\0
//   - \cz -> \cz\cz
//
// decoding to bytes, the following is produced:
//   - \cz\0  -> C0 80
//   - \cz\cz -> 1A
//
// additionally, for dealing with raw binary data we have an escape sequence
// to pack base64 encoded runs:
//
//   - \cz\xNN -> followed by NN-0x1f (31 decimal) bytes of base64 encoded
//                data. supported range: 0x20 .. 0x9f (1-128 bytes data)
//

function h$pstr(s) {
  var enc = null;
  return function() {
    if(enc === null) {
      enc = h$encodePackedUtf8(s);
    }
    return enc;
  }
}
// encode a raw string from bytes
function h$rstr(d) {
  var enc = null;
  return function() {
    if(enc === null) {
      enc = h$rawStringData(d);
    }
    return enc;
  }
}

// these aren't added to the CAFs, so the list stays in mem indefinitely, is that a problem?





function h$strt(str) { return (h$c1(h$lazy_e, (function() { return h$toHsString(str); }))); }
function h$strta(str) { return (h$c1(h$lazy_e, (function() { return h$toHsStringA(str); }))); }
function h$strtb(arr) { return (h$c1(h$lazy_e, (function() { return h$toHsStringMU8(arr); }))); }


// unpack strings without thunks






function h$ustra(str) { return h$toHsStringA(str); }
function h$ustr(str) { return h$toHsString(str); }
function h$urstra(arr) { return h$toHsList(arr); }
function h$urstr(arr) { return h$toHsStringMU8(arr); }


function h$caseMapping(x) {
    return (x%2)?-((x+1)>>1):(x>>1);
}

var h$toUpper = null;
function h$u_towupper(ch) {
    if(h$toUpper == null) { h$toUpper = h$decodeMapping(h$toUpperMapping, h$caseMapping); }
    return ch+(h$toUpper[ch]|0);
}

var h$toLower = null;
function h$u_towlower(ch) {
    if(h$toLower == null) { h$toLower = h$decodeMapping(h$toLowerMapping, h$caseMapping); }
    return ch+(h$toLower[ch]|0);
}

var h$toTitle = null;
function h$u_towtitle(ch) {
    if(h$toTitle == null) { h$toTitle = h$decodeMapping(h$toTitleMapping, h$caseMapping); }
    return ch+(h$toTitle[ch]|0);
}

var h$alpha = null;
function h$u_iswalpha(a) {
    if(h$alpha == null) { h$alpha = h$decodeRLE(h$alphaRanges); }
    return h$alpha[a]|0;
}

var h$alnum = null;
function h$u_iswalnum(a) {
  if(h$alnum == null) { h$alnum = h$decodeRLE(h$alnumRanges); }
  return h$alnum[a] == 1 ? 1 : 0;
}

// var h$spaceChars = [9,10,11,12,13,32,160,5760,8192,8193,8194,8195,8196,8197,8198,8199,8200,8201,8202,8239,8287,12288];
function h$isSpace(a) {
    if(a<5760) return a===32||(a>=9&&a<=13)||a===160;
    return (a>=8192&&a<=8202)||a===5760||a===8239||a===8287||a===12288;
}

function h$u_iswspace(a) {
    return h$isSpace(a)?1:0;
}

var h$lower = null;
function h$u_iswlower(a) {
    if(h$lower == null) { h$lower = h$decodeRLE(h$lowerRanges); }
    if(a < 0x30000) return h$lower[a]|0;
    if(a < 0xE0000) return 0;
    return h$lower[a-0xB0000]|0;
}

var h$upper = null;
function h$u_iswupper(a) {
    if(h$upper == null) { h$upper = h$decodeRLE(h$upperRanges); }
    if(a < 0x30000) return h$upper[a]|0;
    if(a < 0xE0000) return 0;
    return h$upper[a-0xB0000]|0;
}


var h$cntrlChars = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159];
var h$cntrl = null;
function h$u_iswcntrl(a) {
    if(h$cntrl === null) {
        h$cntrl = [];
        for(var i=0;i<=159;i++) h$cntrl[i] = (h$cntrlChars.indexOf(i) !== -1) ? 1 : 0;
    }
    return a <= 159 ? h$cntrl[a] : 0;
}

var h$print = null;
function h$u_iswprint(a) {
    if(h$print == null) { h$print = h$decodeRLE(h$printRanges); }
    if(a < 0x30000) return h$print[a]|0;
    if(a < 0xE0000) return 0;
    return h$print[a-0xB0000]|0;
}

// decode a packed string (Compactor encoding method) to an array of numbers
function h$decodePacked(s) {
    function f(o) {
        var c = s.charCodeAt(o);
        return c<34?c-32:c<92?c-33:c-34;
    }
    var r=[], i=0;
    while(i < s.length) {
        var c = s.charCodeAt(i);
        if(c < 124) r.push(f(i++));
        else if(c === 124) {
            i += 3; r.push(90+90*f(i-2)+f(i-1));
        } else if(c === 125) {
            i += 4;
            r.push(8190+8100*f(i-3)+90*f(i-2)+f(i-1));
        } else throw ("h$decodePacked: invalid: " + c);
    }
    return r;
}

// decode string with encoded character ranges
function h$decodeRLE(str) {
    var r = [], x = 0, i = 0, j = 0, v, k, a = h$decodePacked(str);
    while(i < a.length) {
        v = a[i++];
        if(v === 0) { // alternating
            k = a[i++];
            while(k--) {
                r[j++] = x;
                r[j++] = 1-x;
            }
        } else {
            if(v <= 2) {
                k = (a[i]<<16)+a[i+1];
                i+=2;
            } else k = (v-1)>>1;
            if(v%2) {
                r[j++] = x;
                x = 1-x;
            }
            while(k--) r[j++] = x;
            x = 1-x;
        }
    }
    r.shift();
    return r;
}

function h$decodeMapping(str, f) {
    var r = [], i = 0, j = 0, k, v, v2, a = h$decodePacked(str);
    while(i < a.length) {
        v = a[i++];
        if(v === 0) { // alternating
            k = a[i];
            v = f(a[i+1]);
            v2 = f(a[i+2]);
            while(k--) {
                r[j++] = v;
                r[j++] = v2;
            }
            i+=3;
        } else {
            if(v === 2) {
                k = (a[i] << 16) + a[i+1];
                v = a[i+2];
                i += 3;
            } else if(v%2) {
                k = 1;
                v = v>>1;
            } else {
                k = (v>>1)-1;
                v = a[i++];
            }
            v = f(v);
            while(k--) r[j++] = v;
        }
    }
    return r;
}

var h$unicodeCat = null;
function h$u_gencat(a) {
    if(h$unicodeCat == null) h$unicodeCat = h$decodeMapping(h$catMapping, function(x) { return x; });
    // private use
    if(a >= 0xE000 && a <= 0xF8FF || a >= 0xF0000 & a <= 0xFFFFD || a >= 0x100000 && a <= 0x10FFFD) return 28;
    var c = a < 0x30000 ? (h$unicodeCat[a]|0) :
        (a < 0xE0000 ? 0 : (h$unicodeCat[a-0xB0000]|0));
    return c?c-1:29;
}

function h$localeEncoding() {
   // h$log("### localeEncoding");
   { h$ret1 = (0); return (h$encodeUtf8("UTF-8")); }; // offset 0
}

function h$rawStringData(str) {
    var v = h$newByteArray(str.length+1);
    var u8 = v.u8;
    for(var i=0;i<str.length;i++) {
       u8[i] = str[i];
    }
    u8[str.length] = 0;
    return v;
}

// encode a javascript string to a zero terminated utf8 byte array
function h$encodeUtf8(str) {
  return h$encodeUtf8Internal(str, false, false);
}

function h$encodeModifiedUtf8(str) {
  return h$encodeUtf8Internal(str, true, false);
}

function h$encodePackedUtf8(str) {
  return h$encodeUtf8Internal(str, false, true);
}

// modified: encode \0     -> 192 128
// packed:   encode \cz\cz -> 26
//                  \cz\0  -> 192 128
function h$encodeUtf8Internal(str, modified, packed) {
  var i, j, c, low, b64bytes, b64chars;
  function base64val(cc) {
    if(cc >= 65 && cc <= 90) return cc - 65; // A-Z
    if(cc >= 97 && cc <= 122) return cc - 71; // a-z
    if(cc >= 48 && cc <= 57) return cc + 4; // 0-9
    if(cc === 43) return 62; // +
    if(cc === 47) return 63; // /
    if(cc === 61) return 0; // = (treat padding as zero)
    throw new Error("invalid base64 value: " + cc);
  }
  var n = 0;
  var czescape = false;
  for(i=0;i<str.length;i++) {
    // non-BMP encoded as surrogate pair in JavaScript string, get actual codepoint
    var c = str.charCodeAt(i);
    if (0xD800 <= c && c <= 0xDBFF) {
      low = str.charCodeAt(i+1);
      c = ((c - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000;
      i++;
    }
    if(czescape) {
      if(c === 26) { // \cz\cz -> 26
        n+=1;
      } else if(c === 0) { // \cz\0 -> 192 128
        n+=2
      } else if(c >= 0x20 && c <= 0x9f) {
        b64bytes = c - 0x1f; // number of bytes in base64 encoded run
        b64chars = ((b64bytes + 2) / 3) << 2;
        n += b64bytes;
        i += b64chars;
      } else {
        throw new Error("invalid cz escaped character: " + c);
      }
      czescape = false;
    } else {
      if(c === 26 && packed) {
        czescape = true;
      } else if(c === 0 && modified) {
        n+=2;
      } else if(c <= 0x7F) {
        n++;
      } else if(c <= 0x7FF) {
        n+=2;
      } else if(c <= 0xFFFF) {
        n+=3;
      } else if(c <= 0x1FFFFF) {
        n+=4;
      } else if(c <= 0x3FFFFFF) {
        n+=5;
      } else {
        n+=6;
      }
    }
  }
  var v = h$newByteArray(n+1);
  var u8 = v.u8;
  n = 0;
  for(i=0;i<str.length;i++) {
    c = str.charCodeAt(i);
    // non-BMP encoded as surrogate pair in JavaScript string, get actual codepoint
    if (0xD800 <= c && c <= 0xDBFF) {
      low = str.charCodeAt(i+1);
      c = ((c - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000;
      i++;
    }
//    h$log("### encoding char " + c + " to UTF-8: " + String.fromCodePoint(c));
    if(packed && !czescape && c === 26) {
      czescape = true;
    } else if(c === 0 && (modified || czescape)) {
      u8[n] = 192;
      u8[n+1] = 128;
      n+=2;
      czescape = false;
    } else if(czescape) {
      if(c >= 0x20 && c <= 0x9f) {
        b64bytes = c - 0x1f;
        while(b64bytes > 0) {
          var c1 = base64val(str.charCodeAt(i+1)),
              c2 = base64val(str.charCodeAt(i+2)),
              c3 = base64val(str.charCodeAt(i+3)),
              c4 = base64val(str.charCodeAt(i+4));
          i+=4;
          u8[n] = (c1<<2)|(c2>>4);
          n++;
          if(b64bytes >= 2) {
            u8[n] = ((c2&0xf)<<4)|(c3 >> 2);
            n++;
          }
          if(b64bytes >= 3) {
            u8[n] = ((c3&0x3)<<6)|c4;
            n++;
          }
          b64bytes -= 3;
        }
      } else {
        u8[n] = c;
        n++;
      }
      czescape = false;
    } else if(c <= 0x7F) {
      u8[n] = c;
      n++;
    } else if(c <= 0x7FF) {
      u8[n] = (c >> 6) | 0xC0;
      u8[n+1] = (c & 0x3F) | 0x80;
      n+=2;
    } else if(c <= 0xFFFF) {
      u8[n] = (c >> 12) | 0xE0;
      u8[n+1] = ((c >> 6) & 0x3F) | 0x80;
      u8[n+2] = (c & 0x3F) | 0x80;
      n+=3;
    } else if(c <= 0x1FFFFF) {
      u8[n] = (c >> 18) | 0xF0;
      u8[n+1] = ((c >> 12) & 0x3F) | 0x80;
      u8[n+2] = ((c >> 6) & 0x3F) | 0x80;
      u8[n+3] = (c & 0x3F) | 0x80;
      n+=4;
    } else if(c <= 0x3FFFFFF) {
      u8[n] = (c >> 24) | 0xF8;
      u8[n+1] = ((c >> 18) & 0x3F) | 0x80;
      u8[n+2] = ((c >> 12) & 0x3F) | 0x80;
      u8[n+3] = ((c >> 6) & 0x3F) | 0x80;
      u8[n+4] = (c & 0x3F) | 0x80;
      n+=5;
    } else {
      u8[n] = (c >>> 30) | 0xFC;
      u8[n+1] = ((c >> 24) & 0x3F) | 0x80;
      u8[n+2] = ((c >> 18) & 0x3F) | 0x80;
      u8[n+3] = ((c >> 12) & 0x3F) | 0x80;
      u8[n+4] = ((c >> 6) & 0x3F) | 0x80;
      u8[n+5] = (c & 0x3F) | 0x80;
      n+=6;
    }
  }
  u8[v.len-1] = 0; // terminator
//  h$log("### encodeUtf8: " + str);
//  h$log(v);
  return v;
}


// encode a javascript string to a zero terminated utf16 byte array
function h$encodeUtf16(str) {
  var n = 0;
  var i;
  for(i=0;i<str.length;i++) {
    var c = str.charCodeAt(i);
    if(c <= 0xFFFF) {
      n += 2;
    } else {
      n += 4;
    }
  }
  var v = h$newByteArray(n+1);
  var dv = v.dv;
  n = 0;
  for(i=0;i<str.length;i++) {
    var c = str.charCodeAt(i);
    if(c <= 0xFFFF) {
      dv.setUint16(n, c, true);
      n+=2;
    } else {
      var c0 = c - 0x10000;
      dv.setUint16(n, c0 >> 10, true);
      dv.setUint16(n+2, c0 & 0x3FF, true);
      n+=4;
    }
  }
  dv.setUint8(v.len-1,0); // terminator
  return v;
}


/*
function h$encodeUtf16(str) {
  var b = new DataView(new ArrayBuffer(str.length * 2));
  for(var i=str.length-1;i>=0;i--) {
    b.setUint16(i<<1, str.charCodeAt(i));
  }
  h$ret1 = 0;
  return b;
}
var h$eU16 = h$encodeUtf16;

function h$decodeUtf16(v,start) {
  return h$decodeUtf16(v, v.byteLength - start, start);
}

function h$decodeUtf16z(v,start) {
  var len = v.byteLength - start;
  for(var i=start;i<l;i+=2) {
    if(v.getUint16(i) === 0) {
      len = i;
      break;
    }
  }
  return h$decodeUtf16l(v,l,start)
}
*/

function h$decodeUtf16l(v, byteLen, start) {
  // perhaps we can apply it with an Uint16Array view, but that might give us endianness problems
  var a = [];
  for(var i=0;i<byteLen;i+=2) {
    a[i>>1] = v.dv.getUint16(i+start,true);
  }
  return h$charCodeArrayToString(arr);
}
var h$dU16 = h$decodeUtf16;

// decode a buffer with UTF-8 chars to a JS string
// stop at the first zero
function h$decodeUtf8z(v,start) {
//  h$log("h$decodeUtf8z");
  var n = start;
  var max = v.len;
  while(n < max) {
//    h$log("### " + n + " got char: " + v.u8[n]);
    if(v.u8[n] === 0) { break; }
    n++;
  }
  return h$decodeUtf8(v,n,start);
}

// decode a buffer with Utf8 chars to a JS string
// invalid characters are ignored
function h$decodeUtf8(v,n0,start) {
//  h$log("### decodeUtf8");
//  h$log(v);
  var n = n0 || v.len;
  var arr = [];
  var i = start || 0;
  var code;
  var u8 = v.u8;
//  h$log("### decoding, starting at:  " + i);
  while(i < n) {
    var c = u8[i];
    while((c & 0xC0) === 0x80) {
      c = u8[++i];
    }
//    h$log("### lead char: " + c);
    if((c & 0x80) === 0) {
      code = (c & 0x7F);
      i++;
    } else if((c & 0xE0) === 0xC0) {
      code = ( ((c & 0x1F) << 6)
             | (u8[i+1] & 0x3F)
             );
      i+=2;
    } else if((c & 0xF0) === 0xE0) {
      code = ( ((c & 0x0F) << 12)
             | ((u8[i+1] & 0x3F) << 6)
             | (u8[i+2] & 0x3F)
             );
      i+=3;
    } else if ((c & 0xF8) === 0xF0) {
      code = ( ((c & 0x07) << 18)
             | ((u8[i+1] & 0x3F) << 12)
             | ((u8[i+2] & 0x3F) << 6)
             | (u8[i+3] & 0x3F)
             );
      i+=4;
    } else if((c & 0xFC) === 0xF8) {
      code = ( ((c & 0x03) << 24)
             | ((u8[i+1] & 0x3F) << 18)
             | ((u8[i+2] & 0x3F) << 12)
             | ((u8[i+3] & 0x3F) << 6)
             | (u8[i+4] & 0x3F)
             );
      i+=5;
    } else {
      code = ( ((c & 0x01) << 30)
             | ((u8[i+1] & 0x3F) << 24)
             | ((u8[i+2] & 0x3F) << 18)
             | ((u8[i+3] & 0x3F) << 12)
             | ((u8[i+4] & 0x3F) << 6)
             | (u8[i+5] & 0x3F)
             );
      i+=6;
    }
    // h$log("### decoded codePoint: " + code + " - " + String.fromCharCode(code)); // String.fromCodePoint(code));
    // need to deal with surrogate pairs
    if(code > 0xFFFF) {
      var offset = code - 0x10000;
      arr.push(0xD800 + (offset >> 10), 0xDC00 + (offset & 0x3FF));
    } else {
      arr.push(code);
    }
  }
  return h$charCodeArrayToString(arr);
}

// fixme what if terminator, then we read past end
function h$decodeUtf16(v) {
  var n = v.len;
  var arr = [];
  var dv = v.dv;
  for(var i=0;i<n;i+=2) {
    arr.push(dv.getUint16(i,true));
  }
  return h$charCodeArrayToString(arr);
}

function h$charCodeArrayToString(arr) {
    if(arr.length <= 60000) {
 return String.fromCharCode.apply(this, arr);
    }
    var r = '';
    for(var i=0;i<arr.length;i+=60000) {
 r += String.fromCharCode.apply(this, arr.slice(i, i+60000));
    }
    return r;
}

function h$hs_iconv_open(to,to_off,from,from_off) {
  h$errno = h$EINVAL; // no encodings supported
  return -1;
//  var fromStr = decodeUtf8(from, from_off);
//  var toStr = decodeUtf8(to, to_off);
//  h$log("#### hs_iconv_open: " + fromStr + " -> " + toStr);
//  return 1; // fixme?
}

function h$hs_iconv_close(iconv) {
  return 0;
}

// ptr* -> ptr (array)
function h$derefPtrA(ptr, ptr_off) {
  return ptr.arr[ptr_off][0];
}
// ptr* -> ptr (offset)
function h$derefPtrO(ptr, ptr_off) {
  return ptr.arr[ptr_off][1];
}

// word** -> word    ptr[x][y]
function h$readPtrPtrU32(ptr, ptr_off, x, y) {
  x = x || 0;
  y = y || 0;
  var arr = ptr.arr[ptr_off + 4 * x];
  return arr[0].dv.getInt32(arr[1] + 4 * y, true);
}

// char** -> char   ptr[x][y]
function h$readPtrPtrU8(ptr, ptr_off, x, y) {
  x = x || 0;
  y = y || 0;
  var arr = ptr.arr[ptr_off + 4 * x];
  return arr[0].dv.getUint8(arr[1] + y);
}

// word**   ptr[x][y] = v
function h$writePtrPtrU32(ptr, ptr_off, v, x, y) {
  x = x || 0;
  y = y || 0;
  var arr = ptr.arr[ptr_off + 4 * x];
  arr[0].dv.putInt32(arr[1] + y, v);
}

// unsigned char** ptr[x][y] = v
function h$writePtrPtrU8(ptr, ptr_off, v, x, y) {
  x = x || 0;
  y = y || 0;
  var arr = ptr.arr[ptr_off+ 4 * x];
  arr[0].dv.putUint8(arr[1] + y, v);
}

// convert JavaScript String to a Haskell String



function h$toHsString(str) {

  if(typeof str !== 'string') return h$ghczmprimZCGHCziTypesziZMZN;
  var i = str.length - 1;
  var r = h$ghczmprimZCGHCziTypesziZMZN;
  while(i>=0) {
    var cp = str.charCodeAt(i);
    if(cp >= 0xDC00 && cp <= 0xDFFF && i > 0) {
      --i;
      cp = (cp - 0xDC00) + (str.charCodeAt(i) - 0xD800) * 1024 + 0x10000;
    }
    r = (h$c2(h$ghczmprimZCGHCziTypesziZC_con_e, (cp), (r)));
    --i;
  }
  return r;
}

// string must have been completely forced first
function h$fromHsString(str) {
    var xs = '';
    while(((str).f === h$ghczmprimZCGHCziTypesziZC_con_e)) {
 var h = ((str).d1);
 xs += String.fromCharCode(((typeof(h) === 'number')?(h):(h).d1));
        str = ((str).d2);
    }
    return xs;
}

// list of JSVal to array, list must have been completely forced first
function h$fromHsListJSVal(xs) {
    var arr = [];
    while(((xs).f === h$ghczmprimZCGHCziTypesziZC_con_e)) {
        arr.push(((((xs).d1)).d1));
        xs = ((xs).d2);
    }
    return arr;
}

// ascii only version of the above



function h$toHsStringA(str) {

    if(typeof str !== 'string') return h$ghczmprimZCGHCziTypesziZMZN;
    var i = str.length - 1;
    var r = h$ghczmprimZCGHCziTypesziZMZN;
    while(i>=0) {
 r = (h$c2(h$ghczmprimZCGHCziTypesziZC_con_e, (str.charCodeAt(i)), (r)));
 --i;
    }
    return r;
}

// convert array with modified UTF-8 encoded text



function h$toHsStringMU8(arr) {

    var accept = false, b, n = 0, cp = 0, r = h$ghczmprimZCGHCziTypesziZMZN;
    while(i >= 0) {
        b = arr[i];
        if(!(b & 128)) {
            cp = b;
            accept = true;
        } else if((b & 192) === 128) {
            cp += (b & 32) * Math.pow(64, n)
        } else {
            cp += (b&((1<<(6-n))-1)) * Math.pow(64, n);
            accept = true;
        }
        if(accept) {
            r = (h$c2(h$ghczmprimZCGHCziTypesziZC_con_e, (cp), (r)));
            cp = 0
            n = 0;
        } else {
            n++;
        }
        accept = false;
        i--;
    }
    return r;
}




function h$toHsList(arr) {

  var r = h$ghczmprimZCGHCziTypesziZMZN;
  for(var i=arr.length-1;i>=0;i--) {
    r = (h$c2(h$ghczmprimZCGHCziTypesziZC_con_e, (arr[i]), (r)));
  }
  return r;
}

// array of JS values to Haskell list of JSVal



function h$toHsListJSVal(arr) {

    var r = h$ghczmprimZCGHCziTypesziZMZN;
    for(var i=arr.length-1;i>=0;i--) {
 r = (h$c2(h$ghczmprimZCGHCziTypesziZC_con_e, ((h$c1(h$ghcjszmprimZCGHCJSziPrimziJSVal_con_e, (arr[i])))), (r)));
    }
    return r;
}

// unpack ascii string, append to existing Haskell string



function h$appendToHsStringA(str, appendTo) {

  var i = str.length - 1;
  var r = appendTo;
  while(i>=0) {
    r = (h$c2(h$ghczmprimZCGHCziTypesziZC_con_e, (str.charCodeAt(i)), (r)));
    --i;
  }
  return r;
}

// throw e wrapped in a GHCJS.Prim.JSException  in the current thread
function h$throwJSException(e) {
  // create a JSException object and  wrap it in a SomeException
  // adding the Exception dictionary
  var someE = (h$c2(h$baseZCGHCziExceptionziSomeException_con_e,(h$ghcjszmprimZCGHCJSziPrimzizdfExceptionJSException),((h$c2(h$ghcjszmprimZCGHCJSziPrimziJSException_con_e,((h$c1(h$ghcjszmprimZCGHCJSziPrimziJSVal_con_e, (e)))),(h$toHsString(e.toString())))))));






  return h$throw(someE, true);
}






// values defined in Gen2.ClosureInfo







// thread status

/*
 * low-level heap object manipulation macros
 */
// GHCJS.Prim.JSVal







// GHCJS.Prim.JSException





// Exception dictionary for JSException


// SomeException






// GHC.Ptr.Ptr






// GHC.Integer.GMP.Internals
// Data.Maybe.Maybe




// #define HS_NOTHING h$nothing






// Data.List
// Data.Text




// Data.Text.Lazy





// black holes
// can we skip the indirection for black holes?






// resumable thunks


// general deconstruction



// retrieve  a numeric value that's possibly stored as an indirection



// generic lazy values
// generic data constructors and selectors
// unboxed tuple returns
// #define RETURN_UBX_TUP1(x) return x;








// set up debug logging for the current JS environment/engine
// browser also logs to <div id="output"> if jquery is detected
// the various debug tracing options use h$log
function h$log() {







  try {
        console.log.apply(console, arguments);






  } catch(ex) {
    // ignore console.log exceptions (for example for IE9 when console is closed)
  }
}

function h$collectProps(o) {
  var props = [];
  for(var p in o) { props.push(p); }
  return("{"+props.join(",")+"}");
}



// load the command line arguments in h$programArgs
// the first element is the program name
var h$programArgs;

h$programArgs = [ "a.js" ];
function h$getProgArgv(argc_v,argc_off,argv_v,argv_off) {
                          ;
  var c = h$programArgs.length;
  if(c === 0) {
    argc_v.dv.setInt32(argc_off, 0, true);
  } else {
    argc_v.dv.setInt32(argc_off, c, true);
    var argv = h$newByteArray(4*c);
    argv.arr = [];
    for(var i=0;i<h$programArgs.length;i++) {
      argv.arr[4*i] = [ h$encodeUtf8(h$programArgs[i]), 0 ];
    }
    if(!argv_v.arr) { argv_v.arr = []; }
    argv_v.arr[argv_off] = [argv, 0];
  }
}

function h$setProgArgv(n, ptr_d, ptr_o) {
  args = [];
  for(var i=0;i<n;i++) {
    var p = ptr_d.arr[ptr_o+4*i];
    var arg = h$decodeUtf8z(p[0], p[1]);
    args.push(arg);
  }
  h$programArgs = args;
}

function h$getpid() {



  return 0;
}

function h$cpuTimePrecision() {
  return 1000;
}

var h$fakeCpuTime = 1.0;

function h$getCPUTime() {






  // XXX this allows more testsuites to run
  //     but I don't really like returning a fake value here
  return ++h$fakeCpuTime;
  return -1;
}

function h$__hscore_environ() {
                               ;
    { h$ret1 = (0); return (null); };
}

function h$getenv(name, name_off) {
                       ;







    { h$ret1 = (0); return (null); };
}

function h$errorBelch() {
  h$log("### errorBelch: do we need to handle a vararg function here?");
}

function h$errorBelch2(buf1, buf_offset1, buf2, buf_offset2) {
//  log("### errorBelch2");
  h$errorMsg(h$decodeUtf8z(buf1, buf_offset1), h$decodeUtf8z(buf2, buf_offset2));
}

function h$debugBelch2(buf1, buf_offset1, buf2, buf_offset2) {
  h$errorMsg(h$decodeUtf8z(buf1, buf_offset1), h$decodeUtf8z(buf2, buf_offset2));
}

function h$errorMsg(pat) {





  // poor man's vprintf
  var str = pat;
  for(var i=1;i<arguments.length;i++) {
    str = str.replace(/%s/, arguments[i]);
  }
    if(typeof console !== 'undefined') {
      console.log(str);
    }



}

// this needs to be imported with foreign import ccall safe/interruptible
function h$performMajorGC() {
    // save current thread state so we can enter the GC
    var t = h$currentThread, err = null;
    t.sp = h$sp;
    h$currentThread = null;

    try {
        h$gc(t);
    } catch(e) {
        err = e;
    }

    // restore thread state
    h$currentThread = t;
    h$sp = t.sp;
    h$stack = t.stack;

    if(err) throw err;
}


function h$baseZCSystemziCPUTimeZCgetrusage() {
  return 0;
}

function h$getrusage() {
  return 0;
}


// fixme need to fix these struct locations

function h$gettimeofday(tv_v,tv_o,tz_v,tz_o) {
  var now = Date.now();
  tv_v.dv.setInt32(tv_o, (now / 1000)|0, true);
  tv_v.dv.setInt32(tv_o + 4, ((now % 1000) * 1000)|0, true);
  if(tv_v.len >= tv_o + 12) {
    tv_v.dv.setInt32(tv_o + 8, ((now % 1000) * 1000)|0, true);
  }
  return 0;
}

function h$traceEvent(ev_v,ev_o) {
  h$errorMsg(h$decodeUtf8z(ev_v, ev_o));
}

function h$traceMarker(ev_v,ev_o) {
  h$errorMsg(h$decodeUtf8z(ev_v, ev_o));
}

var h$__hscore_gettimeofday = h$gettimeofday;

var h$myTimeZone = h$encodeUtf8("UTC");
function h$localtime_r(timep_v, timep_o, result_v, result_o) {
  var t = timep_v.i3[timep_o];
  var d = new Date(t * 1000);
  result_v.dv.setInt32(result_o , d.getSeconds(), true);
  result_v.dv.setInt32(result_o + 4 , d.getMinutes(), true);
  result_v.dv.setInt32(result_o + 8 , d.getHours(), true);
  result_v.dv.setInt32(result_o + 12, d.getDate(), true);
  result_v.dv.setInt32(result_o + 16, d.getMonth(), true);
  result_v.dv.setInt32(result_o + 20, d.getFullYear()-1900, true);
  result_v.dv.setInt32(result_o + 24, d.getDay(), true);
  result_v.dv.setInt32(result_o + 28, 0, true); // fixme yday 1-365 (366?)
  result_v.dv.setInt32(result_o + 32, -1, true); // dst information unknown
  result_v.dv.setInt32(result_o + 40, 0, true); // gmtoff?
  if(!result_v.arr) result_v.arr = [];
  result_v.arr[result_o + 40] = [h$myTimeZone, 0];
  result_v.arr[result_o + 48] = [h$myTimeZone, 0];
  { h$ret1 = (result_o); return (result_v); };
}
var h$__hscore_localtime_r = h$localtime_r;

function h$checkForeignRefs(refs) {
  function argSize(t) {
    if(t === "ghc-prim:GHC.Prim.Word64#") return 2;
    if(t === "ghc-prim:GHC.Prim.State#") return 0;
    if(t === "ghc-prim:GHC.Prim.Void#") return 0;
    if(t === "ghc-prim:GHC.Prim.Int#") return 1;
    if(t === "ghc-prim:GHC.Prim.Int64#") return 2;
    if(t === "ghc-prim:GHC.Prim.Weak#") return 1;
    if(t === "ghc-prim:GHC.Prim.Addr#") return 2;
    if(t === "ghc-prim:GHC.Prim.Word#") return 1;
    if(t === "ghc-prim:GHC.Prim.Float#") return 1;
    if(t === "ghc-prim:GHC.Prim.Double#") return 1;
    if(t === "ghc-prim:GHC.Prim.ByteArray#") return 2;
    if(t === "ghc-prim:GHC.Prim.ThreadId#") return 1;
    console.warn("unknown argument type: " + t);
    return 1;
  }
  function callStr(r) {
    return r.pattern + '(' + r.arguments.join(', ') + ') -> ' + r.result + ' ' + r.span;
  }
  function checkRef(r) {
    if(r.cconv === "ccall") {
      var f = null;
      try {
        f = eval(r.pattern);
      } catch(e) { }
      if(!f) {
        console.warn("referenced pattern does not exist: " + callStr(r));
        return;
      }
      if(typeof f !== 'function') {
        console.warn("referenced pattern is not a function: " + callStr(r));
        return;
      }
      var s = 0, ba = 0;
      for(var i = 0; i < r.arguments.length; i++) {
        var a = r.arguments[i];
        s += argSize(a);
        ba += a === "ghc-prim:GHC.Prim.ByteArray#" ? 1 : 0;
      }
      if(f.length != s) {
        console.warn("number of arguments does not seem to match: " + callStr(r));
      }
      if(ba !== 0 && f.length === (s - ba)) {
        console.warn("number of arguments matches old ByteArray calling convention: " + callStr(r));
      }
    }
    // todo: check other calling conventions
  }
  for(var i=0;i<refs.length;i++) {
    checkRef(refs[i]);
  }
}

var h$GHCConcSignalSignalHandlerStore_d = null;
var h$GHCConcSignalSignalHandlerStore_o = 0;

function h$getOrSetGHCConcSignalSignalHandlerStore(d,o) {
  if(d) {
    h$GHCConcSignalSignalHandlerStore_d = d;
    h$GHCConcSignalSignalHandlerStore_o = o;
  }
  { h$ret1 = (h$GHCConcSignalSignalHandlerStore_o); return (h$GHCConcSignalSignalHandlerStore_d); };
}
// some Enum conversion things

// an array of generic enums
var h$enums = [];
function h$initEnums() {
  for(var i=0;i<256;i++) {
    h$enums[i] = h$makeEnum(i);
  }
}
h$initStatic.push(h$initEnums);

function h$makeEnum(tag) {
  var f = function() {
    return h$stack[h$sp];
  }
  h$setObjInfo(f, 2, "Enum", [], tag+1, 0, [1], null);



  return h$c0(f);

}

// used for all non-Bool enums
function h$tagToEnum(tag) {
  if(tag >= h$enums.length) {
    return h$makeEnum(tag);
  } else {
    return h$enums[tag];
  }
}

function h$dataTag(e) {
  return (e===true)?1:((typeof e !== 'object')?0:(e.f.a-1));
}
// weak reference support







// values defined in Gen2.ClosureInfo







// thread status

/*
 * low-level heap object manipulation macros
 */
// GHCJS.Prim.JSVal







// GHCJS.Prim.JSException





// Exception dictionary for JSException


// SomeException






// GHC.Ptr.Ptr






// GHC.Integer.GMP.Internals
// Data.Maybe.Maybe




// #define HS_NOTHING h$nothing






// Data.List
// Data.Text




// Data.Text.Lazy





// black holes
// can we skip the indirection for black holes?






// resumable thunks


// general deconstruction



// retrieve  a numeric value that's possibly stored as an indirection



// generic lazy values
// generic data constructors and selectors
// unboxed tuple returns
// #define RETURN_UBX_TUP1(x) return x;

var h$weakPointerList = [];
// called by the GC after marking the heap
function h$finalizeWeaks(toFinalize) {
    var mark = h$gcMark;
    var i, w;

                                                   ;
    // start a finalizer thread if any finalizers need to be run
    if(toFinalize.length > 0) {
        var t = new h$Thread();
        for(i=0;i<toFinalize.length;i++) {
            w = toFinalize[i];
            t.sp += 6;
            t.stack[t.sp-5] = 0; // mask
            t.stack[t.sp-4] = h$noop; // handler, dummy
            t.stack[t.sp-3] = h$catch_e;
            t.stack[t.sp-2] = h$ap_1_0;
            t.stack[t.sp-1] = w.finalizer;
            t.stack[t.sp] = h$return;
            w.finalizer = null;
        }
        h$wakeupThread(t);
    }
}

var h$weakN = 0;
/** @constructor */
function h$Weak(key, val, finalizer) {
    if(typeof key !== 'object') {
        // can't attach a StableName to objects with unboxed storage
        // our weak ref will be finalized soon.
                                                                          ;
        this.keym = new h$StableName(0);
    } else {
        if(typeof key.m !== 'object') key.m = new h$StableName(key.m);
        this.keym = key.m;
    }
                                                               ;
    this.keym = key.m;
    this.val = val;
    this.finalizer = null;
    if(finalizer !== null) {
        this.finalizer = finalizer;
    }
    this.m = 0;
    this._key = ++h$weakN;
    h$weakPointerList.push(this);
}

function h$makeWeak(key, val, fin) {
                            ;
    return new h$Weak(key, val, fin)
}

function h$makeWeakNoFinalizer(key, val) {
                                       ;
    return new h$Weak(key, val, null);
}

function h$finalizeWeak(w) {
                                                               ;
    w.val = null;
    if(w.finalizer === null || w.finalizer.finalizer === null) {
        { h$ret1 = (0); return (null); };
    } else {
        var r = w.finalizer;
        w.finalizer = null;
        { h$ret1 = (1); return (r); };
    }
}


function h$FastWeak(ticket) {
  this.ticket = ticket;
  this.m = 0;
}

function h$FastWeakTicket(val) {
  this.val = val;
  this.weak = new h$FastWeak(this);
  this.m = 0;
}

function h$FastWeakBag() {
  this.tickets = [];
  this.m = 0;
}

function h$FastWeakBagTicket(bag, val) {
  this.val = val;
  this.bag = bag;
  this.pos = bag.tickets.length;
  bag.tickets.push(this);
  this.m = 0;
};






// values defined in Gen2.ClosureInfo







// thread status

/*
 * low-level heap object manipulation macros
 */
// GHCJS.Prim.JSVal







// GHCJS.Prim.JSException





// Exception dictionary for JSException


// SomeException






// GHC.Ptr.Ptr






// GHC.Integer.GMP.Internals
// Data.Maybe.Maybe




// #define HS_NOTHING h$nothing






// Data.List
// Data.Text




// Data.Text.Lazy





// black holes
// can we skip the indirection for black holes?






// resumable thunks


// general deconstruction



// retrieve  a numeric value that's possibly stored as an indirection



// generic lazy values
// generic data constructors and selectors
// unboxed tuple returns
// #define RETURN_UBX_TUP1(x) return x;
// preemptive threading support

// run gc when this much time has passed (ms)




// preempt threads after the scheduling quantum (ms)




// check sched quantum after 10*GHCJS_SCHED_CHECK calls




// yield to js after running haskell for GHCJS_BUSY_YIELD ms
var h$threadIdN = 0;

// all threads except h$currentThread
// that are not finished/died can be found here
var h$threads = new h$Queue();
var h$blocked = new h$Set();

/** @constructor */
function h$Thread() {
    this.tid = ++h$threadIdN;
    this.status = (0);
    this.stack = [h$done, 0, h$baseZCGHCziConcziSynczireportError, h$catch_e];
    this.sp = 3;
    this.mask = 0; // async exceptions masked (0 unmasked, 1: uninterruptible, 2: interruptible)
    this.interruptible = false; // currently in an interruptible operation
    this.excep = []; // async exceptions waiting for unmask of this thread
    this.delayed = false; // waiting for threadDelay
    this.blockedOn = null; // object on which thread is blocked
    this.retryInterrupted = null; // how to retry blocking operation when interrupted
    this.transaction = null; // for STM
    this.noPreemption = false;
    this.isSynchronous = false;
    this.continueAsync = false;
    this.m = 0; // gc mark
    this.result = null; // result value (used for GHCJS.Foreign.Callback)
    this.resultIsException = false;



    this._key = this.tid; // for storing in h$Set / h$Map
}

function h$rts_getThreadId(t) {
  return t.tid;
}

function h$cmp_thread(t1,t2) {
  if(t1.tid < t2.tid) return -1;
  if(t1.tid > t2.tid) return 1;
  return 0;
}

// description of the thread, if unlabeled then just the thread id
function h$threadString(t) {
  if(t === null) {
    return "<no thread>";
  } else if(t.label) {
    var str = h$decodeUtf8z(t.label[0], t.label[1]);
    return str + " (" + t.tid + ")";
  } else {
    return (""+t.tid);
  }
}

function h$fork(a, inherit) {
  h$r1 = h$forkThread(a, inherit);
  return h$yield();
}

function h$forkThread(a, inherit) {
  var t = new h$Thread();
                                                         ;
  if(inherit && h$currentThread) {
    t.mask = h$currentThread.mask;
  }



  // TRACE_SCHEDULER("sched: action forked: " + a.f.n);
  t.stack[4] = h$ap_1_0;
  t.stack[5] = a;
  t.stack[6] = h$return;
  t.sp = 6;
  h$wakeupThread(t);
  return t;
}

function h$threadStatus(t) {
  // status, capability, locked
  { h$ret1 = (1); h$ret2 = (0); return (t.status); };
}

function h$waitRead(fd) {
  h$fds[fd].waitRead.push(h$currentThread);
  h$currentThread.interruptible = true;
  return h$blockThread(h$currentThread,fd,[h$waitRead,fd]);
}

function h$waitWrite(fd) {
  h$fds[fd].waitWrite.push(h$currentThread);
  h$currentThread.interruptible = true;
  return h$blockThread(h$currentThread,fd,[h$waitWrite,fd]);
}

// threadDelay support:
var h$delayed = new h$HeapSet();
function h$wakeupDelayed(now) {
    while(h$delayed.size() > 0 && h$delayed.peekPrio() < now) {
        var t = h$delayed.pop();
                                                          ;
        // might have been woken up early, don't wake up again in that case
        if(t.delayed) {
            t.delayed = false;
            h$wakeupThread(t);
        }
    }
}

function h$delayThread(time) {
  var now = Date.now();
  var ms = time/1000; // we have no microseconds in JS
                                                                                                     ;
  h$delayed.add(now+ms, h$currentThread);
  h$currentThread.delayed = true;
  h$currentThread.interruptible = true;
  return h$blockThread(h$currentThread, h$delayed,[h$resumeDelayThread]);
}

function h$resumeDelayThread() {
  h$r1 = false;
  return h$rs(); // stack[h$sp];
}

function h$yield() {
  if(h$currentThread.isSynchronous) {
    return h$stack[h$sp];
  } else {
    h$sp += 2;
    h$stack[h$sp-1] = h$r1;
    h$stack[h$sp] = h$return;
    h$currentThread.sp = h$sp;
    return h$reschedule;
  }
}

// raise the async exception in the thread if not masked
function h$killThread(t, ex) {
                                                     ;
  if(t === h$currentThread) {
    // if target is self, then throw even if masked
    h$sp += 2;
    h$stack[h$sp-1] = h$r1;
    h$stack[h$sp] = h$return;
    return h$throw(ex,true);
  } else {
                                                 ;
    if(t.mask === 0 || (t.mask === 2 && t.interruptible)) {
      if(t.stack) { // finished threads don't have a stack anymore
        h$forceWakeupThread(t);
        t.sp += 2;
        t.stack[t.sp-1] = ex;
        t.stack[t.sp] = h$raiseAsync_frame;
      }
      return h$stack ? h$stack[h$sp] : null;
    } else {
      t.excep.push([h$currentThread,ex]);
      h$currentThread.interruptible = true;
      h$sp += 2;
      h$stack[h$sp-1] = h$r1;
      h$stack[h$sp] = h$return;
      return h$blockThread(h$currentThread,t,null);
    }
  }
}

function h$maskStatus() {
                                                         ;
  return h$currentThread.mask;
}

function h$maskAsync(a) {
                                                                    ;
  if(h$currentThread.mask !== 2) {
    if(h$currentThread.mask === 0 && h$stack[h$sp] !== h$maskFrame && h$stack[h$sp] !== h$maskUnintFrame) {
      h$stack[++h$sp] = h$unmaskFrame;
    }
    if(h$currentThread.mask === 1) {
      h$stack[++h$sp] = h$maskUnintFrame;
    }
    h$currentThread.mask = 2;
  }
  h$r1 = a;
  return h$ap_1_0_fast();
}

function h$maskUnintAsync(a) {
                                                                          ;
  if(h$currentThread.mask !== 1) {
    if(h$currentThread.mask === 2) {
      h$stack[++h$sp] = h$maskFrame;
    } else {
      h$stack[++h$sp] = h$unmaskFrame;
    }
    h$currentThread.mask = 1;
  }
  h$r1 = a;
  return h$ap_1_0_fast();
}

function h$unmaskAsync(a) {
                                                               ;
  if(h$currentThread.excep.length > 0) {
    h$currentThread.mask = 0;
    h$sp += 3;
    h$stack[h$sp-2] = h$ap_1_0;
    h$stack[h$sp-1] = a;
    h$stack[h$sp] = h$return;
    return h$reschedule;
  }
  if(h$currentThread.mask !== 0) {
    if(h$stack[h$sp] !== h$unmaskFrame) {
      if(h$currentThread.mask === 2) {
        h$stack[++h$sp] = h$maskFrame;
      } else {
        h$stack[++h$sp] = h$maskUnintFrame;
      }
    }
    h$currentThread.mask = 0;
  }
  h$r1 = a;
  return h$ap_1_0_fast();
}

function h$pendingAsync() {
  var t = h$currentThread;
  return (t.excep.length > 0 && (t.mask === 0 || (t.mask === 2 && t.interruptible)));
}

// post the first of the queued async exceptions to
// this thread, restore frame is in thread if alreadySuspended

function h$postAsync(alreadySuspended,next) {
    var t = h$currentThread;
    var v = t.excep.shift();
                                                                                                                                     ;
    var tposter = v[0]; // posting thread, blocked
    var ex = v[1]; // the exception
    if(v !== null && tposter !== null) {
        h$wakeupThread(tposter);
    }
    if(!alreadySuspended) {
        h$suspendCurrentThread(next);
    }
    h$sp += 2;
    h$stack[h$sp-1] = ex;
    h$stack[h$sp] = h$raiseAsync_frame;
    t.sp = h$sp;
}

// wakeup thread, thread has already been removed
// from any queues it was blocked on
function h$wakeupThread(t) {
                                                             ;
    if(t.status === (1)) {
        t.blockedOn = null;
        t.status = (0);
        h$blocked.remove(t);
    }
    t.interruptible = false;
    t.retryInterrupted = null;
    h$threads.enqueue(t);
    h$startMainLoop();
}

// force wakeup, remove this thread from any
// queue it's blocked on
function h$forceWakeupThread(t) {
                                                            ;
  if(t.status === (1)) {
    h$removeThreadBlock(t);
    h$wakeupThread(t);
  }
}

function h$removeThreadBlock(t) {
  var i;
  if(t.status === (1)) {
    var o = t.blockedOn;
    if(o === null || o === undefined) {
      throw ("h$removeThreadBlock: blocked on null or undefined: " + h$threadString(t));
    } else if(o === h$delayed) {
      // thread delayed
      h$delayed.remove(t);
      t.delayed = false;
    } else if(o instanceof h$MVar) {
                                        ;
                                                                                                               ;
      // fixme this is rather inefficient
      var r, rq = new h$Queue();
      while((r = o.readers.dequeue()) !== null) {
          if(r !== t) rq.enqueue(r);
      }
      var w, wq = new h$Queue();
      while ((w = o.writers.dequeue()) !== null) {
        if(w[0] !== t) wq.enqueue(w);
      }
      o.readers = rq;
      o.writers = wq;
      if(o.waiters) {
        var wa = [], wat;
        for(i=0;i<o.waiters.length;i++) {
          wat = o.waiters[i];
          if(wat !== t) wa.push(wat);
        }
        o.waiters = wa;
      }
                                                                                                              ;
/*    } else if(o instanceof h$Fd) {
      TRACE_SCHEDULER("blocked on fd");
      h$removeFromArray(o.waitRead,t);
      h$removeFromArray(o.waitWrite,t); */
    } else if(o instanceof h$Thread) {
                                                   ;
      // set thread (first in pair) to null, exception will still be delivered
      // but this thread not woken up again
      // fixme: are these the correct semantics?
      for(i=0;i<o.excep.length;i++) {
        if(o.excep[i][0] === t) {
          o.excep[i][0] = null;
          break;
        }
      }
    } else if (o instanceof h$TVarsWaiting) {
      h$stmRemoveBlockedThread(o, t)
    } else if((typeof (o) === 'object' && (o) && (o).f && (o).f.t === (5))) {
                                             ;
      h$removeFromArray(((o).d2),t);
    } else {
      throw ("h$removeThreadBlock: blocked on unknown object: " + h$collectProps(o));
    }
    if(t.retryInterrupted) {
      t.sp+=2;
      t.stack[t.sp-1] = t.retryInterrupted;
      t.stack[t.sp] = h$retryInterrupted;
    }
  }
}

function h$removeFromArray(a,o) {
  var i;
  while((i = a.indexOf(o)) !== -1) {
    a.splice(i,1);
  }
}

function h$finishThread(t) {
                                                             ;
    t.status = (16);
    h$blocked.remove(t);
    t.stack = null;
    t.mask = 0;
    for(var i=0;i<t.excep.length;i++) {
        var v = t.excep[i];
        var tposter = v[0];
        if(v !== null && tposter !== null) {
            h$wakeupThread(tposter);
        }
    }
    t.excep = [];
}

function h$blockThread(t,o,resume) {
                                                            ;
    if(t !== h$currentThread) {
        throw "h$blockThread: blocked thread is not the current thread";
    }
    if(o === undefined || o === null) {
        throw ("h$blockThread, no block object: " + h$threadString(t));
    }
    t.status = (1);
    t.blockedOn = o;
    t.retryInterrupted = resume;
    t.sp = h$sp;
    h$blocked.add(t);
    return h$reschedule;
}

// the main scheduler, called from h$mainLoop
// returns null if nothing to do, otherwise
// the next function to run
var h$lastGc = Date.now();
var h$gcInterval = 60000; // ms
function h$scheduler(next) {
                                                ;
    // if we have a running synchronous thread, the only thing we can do is continue
    if(h$currentThread &&
       h$currentThread.isSynchronous &&
       h$currentThread.status === (0)) {
        return next;
    }
    var now = Date.now();
    h$wakeupDelayed(now);
    // find the next runnable thread in the run queue
    // remove non-runnable threads
    if(h$currentThread && h$pendingAsync()) {
                                                                             ;
        if(h$currentThread.status !== (0)) {
            h$forceWakeupThread(h$currentThread);
            h$currentThread.status = (0);
        }
        h$postAsync(next === h$reschedule, next);
        return h$stack[h$sp];
    }
    var t;
    while(t = h$threads.dequeue()) {
        if(t.status === (0)) { break; }
    }
    // if no other runnable threads, just continue current (if runnable)
    if(t === null) {
                                                           ;
        if(h$currentThread && h$currentThread.status === (0)) {
            // do gc after a while
            if(now - h$lastGc > h$gcInterval) {
                // save active data for the thread on its stack
                if(next !== h$reschedule && next !== null) {
                    h$suspendCurrentThread(next);
                    next = h$stack[h$sp];
                }
                var ct = h$currentThread;
                h$currentThread = null;



                h$gc(ct);
                h$currentThread = ct;



                // gc might replace the stack of a thread, so reload it
                h$stack = h$currentThread.stack;
                h$sp = h$currentThread.sp
            }
                                                                                    ;
            return (next===h$reschedule || next === null)?h$stack[h$sp]:next; // just continue
        } else {
                                             ;
            h$currentThread = null;



            // We could set a timer here so we do a gc even if Haskell pauses for a long time.
            // However, currently this isn't necessary because h$mainLoop always sets a timer
            // before it pauses.
            if(now - h$lastGc > h$gcInterval)
                h$gc(null);
            return null; // pause the haskell runner
        }
    } else { // runnable thread in t, switch to it
                                                                    ;
        if(h$currentThread !== null) {
            if(h$currentThread.status === (0)) {
                h$threads.enqueue(h$currentThread);
            }
            // if h$reschedule called, thread takes care of suspend
            if(next !== h$reschedule && next !== null) {
                                                                                        ;
                // suspend thread: push h$restoreThread stack frame
                h$suspendCurrentThread(next);
            } else {
                                                                                                                       ;
                h$currentThread.sp = h$sp;
            }
            if(h$pendingAsync()) h$postAsync(true, next);
        } else {
                                                                          ;
        }
        // gc if needed
        if(now - h$lastGc > h$gcInterval) {
            h$currentThread = null;



            h$gc(t);
        }
        // schedule new one
        h$currentThread = t;
        h$stack = t.stack;
        h$sp = t.sp;



                                                                                  ;
        // TRACE_SCHEDULER("sp thing: " + h$stack[h$sp].n);
        // h$dumpStackTop(h$stack,0,h$sp);
        return h$stack[h$sp];
    }
}

function h$scheduleMainLoop() {
                                                       ;
    if(h$mainLoopImmediate) return;
    h$clearScheduleMainLoop();
    if(h$delayed.size() === 0) {



                                                                                    ;
            h$mainLoopTimeout = setTimeout(h$mainLoop, h$gcInterval);



        return;
    }
    var now = Date.now();
    var delay = Math.min(Math.max(h$delayed.peekPrio()-now, 0), h$gcInterval);



        if(delay >= 1) {
                                                                             ;
            // node.js 0.10.30 has trouble with non-integral delays
            h$mainLoopTimeout = setTimeout(h$mainLoop, Math.round(delay));
        } else {
            h$mainLoopImmediate = setImmediate(h$mainLoop);
        }



}

var h$animationFrameMainLoop = false;




function h$clearScheduleMainLoop() {
    if(h$mainLoopTimeout) {
        clearTimeout(h$mainLoopTimeout);
        h$mainLoopTimeout = null;
    }
    if(h$mainLoopImmediate) {
        clearImmediate(h$mainLoopImmediate);
        h$mainLoopImmediate = null;
    }
    if(h$mainLoopFrame) {
        cancelAnimationFrame(h$mainLoopFrame);
        h$mainLoopFrame = null;
    }
}

function h$startMainLoop() {
                                                    ;
    if(h$running) return;



        if(!h$mainLoopImmediate) {
            h$clearScheduleMainLoop();
            h$mainLoopImmediate = setImmediate(h$mainLoop);
        }
}
var h$busyYield = 500;
var h$schedQuantum = 25;

var h$mainLoopImmediate = null; // immediate id if main loop has been scheduled immediately
var h$mainLoopTimeout = null; // timeout id if main loop has been scheduled with a timeout
var h$mainLoopFrame = null; // timeout id if main loop has been scheduled with an animation frame
var h$running = false;
var h$nextThread = null;
function h$mainLoop() {





  if(h$running) return;
  h$clearScheduleMainLoop();
  if(h$currentThread) {
    h$scheduleMainLoop();
    return;
  }
  h$running = true;
  h$runInitStatic();
  h$currentThread = h$nextThread;



  if(h$nextThread !== null) {
    h$stack = h$currentThread.stack;
    h$sp = h$currentThread.sp;
  }
  var c = null;
  var start = Date.now();
  do {
    c = h$scheduler(c);
    if(c === null) { // no running threads
      h$nextThread = null;
      h$running = false;
      h$currentThread = null;



      h$scheduleMainLoop();
      return;
    }
    // yield to js after h$busyYield (default value GHCJS_BUSY_YIELD)
    if(!h$currentThread.isSynchronous && Date.now() - start > h$busyYield) {
                                       ;
      if(c !== h$reschedule) h$suspendCurrentThread(c);
      h$nextThread = h$currentThread;
      h$currentThread = null;



      h$running = false;
      if(h$animationFrameMainLoop) {
        h$mainLoopFrame = requestAnimationFrame(h$mainLoop);
      } else {
        h$mainLoopImmediate = setImmediate(h$mainLoop);
      }
      return;
    }




    c = h$runThreadSliceCatch(c);

  } while(true);
}

function h$runThreadSliceCatch(c) {
  try {
    return h$runThreadSlice(c);
  } catch(e) {
    // uncaught exception in haskell code, kill thread



    c = null;
    if(h$stack && h$stack[0] === h$doneMain_e) {
      h$stack = null;
      h$reportMainLoopException(e, true);
      h$doneMain_e();
    } else {
      h$stack = null;
      h$reportMainLoopException(e, false);
    }
    h$finishThread(h$currentThread);
    h$currentThread.status = (17);
    h$currentThread = null;
  }
  return h$reschedule;
}

/*
  run thread h$currentThread for a single time slice

     - c: the next function to call from the trampoline

  returns:
    the next function to call in this thread

  preconditions:
    h$currentThread is the thread to run
    h$stack         is the stack of this thread
    h$sp            is the stack pointer
  
    any global variables needed to pass arguments have been set
    the caller has to update the thread state object
 */
function h$runThreadSlice(c) {
  var count, scheduled = Date.now();
  while(c !== h$reschedule &&
        (h$currentThread.noPreemption || h$currentThread.isSynchronous ||
         (Date.now() - scheduled < h$schedQuantum))) {
    count = 0;
    while(c !== h$reschedule && ++count < 1000) {
      c = c();

      c = c();
      c = c();
      c = c();
      c = c();
      c = c();
      c = c();
      c = c();
      c = c();
      c = c();

    }
    if(c === h$reschedule &&
       (h$currentThread.noPreemption || h$currentThread.isSynchronous) &&
       h$currentThread.status === (1)) {
      c = h$handleBlockedSyncThread(c);
    }
  }
  return c;
}

function h$reportMainLoopException(e, isMainThread) {
  if(e instanceof h$ThreadAbortedError) return;
  var main = isMainThread ? " main" : "";
  h$log("uncaught exception in Haskell" + main + " thread: " + e.toString());
  if(e.stack) h$log(e.stack);
}


function h$handleBlockedSyncThread(c) {
                                                 ;
  /*
    if we have a blocked synchronous/non-preemptible thread,
    and it's blocked on a black hole, first try to clear
    it.
   */
  var bo = h$currentThread.blockedOn;
  if(h$currentThread.status === (1) &&
     (typeof (bo) === 'object' && (bo) && (bo).f && (bo).f.t === (5)) &&
     h$runBlackholeThreadSync(bo)) {
                                                    ;
    c = h$stack[h$sp];
  }
  /*
    if still blocked, then either fall back to async,
    or throw a WouldBlock exception
   */
  if(h$currentThread.isSynchronous && h$currentThread.status === (1)) {
    if(h$currentThread.continueAsync) {
      h$currentThread.isSynchronous = false;
      h$currentThread.continueAsync = false;
    } else if(h$currentThread.isSynchronous) {
                                                               ;
      h$sp += 2;
      h$currentThread.sp = h$sp;
      h$stack[h$sp-1] = h$ghcjszmprimZCGHCJSziPrimziInternalziwouldBlock;
      h$stack[h$sp] = h$raiseAsync_frame;
      h$forceWakeupThread(h$currentThread);
      c = h$raiseAsync_frame;
    } // otherwise a non-preemptible thread, keep it in the same state
  }
  return c;
}

// run the supplied IO action in a new thread
// returns immediately, thread is started in background
function h$run(a) {
                                           ;
  var t = h$forkThread(a, false);
  h$startMainLoop();
  return t;
}

/** @constructor */
function h$WouldBlock() {

}

h$WouldBlock.prototype.toString = function() {
  return "Haskell Operation would block";
}

/** @constructor */
function h$HaskellException(msg) {
  this._msg = msg;
}

h$HaskellException.prototype.toString = function() {
  return this._msg;
}

function h$setCurrentThreadResultWouldBlock() {
  h$currentThread.result = new h$WouldBlock();
  h$currentThread.resultIsException = true;
}

function h$setCurrentThreadResultJSException(e) {
  h$currentThread.result = e;
  h$currentThread.resultIsException = true;
}

function h$setCurrentThreadResultHaskellException(msg) {
  h$currentThread.result = new h$HaskellException(msg);
  h$currentThread.resultIsException = true;
}

function h$setCurrentThreadResultValue(v) {
  h$currentThread.result = v;
  h$currentThread.resultIsException = false;
}

/*
   run a Haskell (IO JSVal) action synchronously, returning
   the result. Uncaught Haskell exceptions are thrown as a
   h$HaskellException. If the action could not finish due to
   blocking, a h$WouldBlock exception is thrown instead.

     - a:    the (IO JSVal) action
     - cont: continue async if blocked
         (the call to h$runSyncReturn would still throw h$WouldBlock,
          since there would be no return value)

   returns: the result of the IO action
 */
function h$runSyncReturn(a, cont) {
  var t = new h$Thread();
                                                                         ;
  var aa = (h$c2(h$ap1_e,(h$ghcjszmprimZCGHCJSziPrimziInternalzisetCurrentThreadResultValue),(a)));
  h$runSyncAction(t, aa, cont);
  if(t.status === (16)) {
    if(t.resultIsException) {
      throw t.result;
    } else {
      return t.result;
    }
  } else if(t.status === (1)) {
    throw new h$WouldBlock();
  } else {
    throw new Error("h$runSyncReturn: Unexpected thread status: " + t.status);
  }
}

/*
   run a Haskell IO action synchronously, ignoring the result
   or any exception in the Haskell code
     
     - a:    the IO action
     - cont: continue async if blocked

   returns: true if the action ran to completion, false otherwise

   throws: any uncaught Haskell or JS exception except WouldBlock
 */
function h$runSync(a, cont) {
  var t = new h$Thread();
                                                                   ;
  h$runSyncAction(t, a, cont);
  if(t.resultIsException) {
    if(t.result instanceof h$WouldBlock) {
      return false;
    } else {
      throw t.result;
    }
  }
  return t.status === (16);
}

function h$runSyncAction(t, a, cont) {
  h$runInitStatic();
  var c = h$return;
  t.stack[2] = h$ghcjszmprimZCGHCJSziPrimziInternalzisetCurrentThreadResultException;
  t.stack[4] = h$ap_1_0;
  t.stack[5] = a;
  t.stack[6] = h$return;
  t.sp = 6;
  t.status = (0);




  t.isSynchronous = true;
  t.continueAsync = cont;
  var ct = h$currentThread;
  var csp = h$sp;
  var cr1 = h$r1; // do we need to save more than this?
  var caught = false, excep = null;
  h$currentThread = t;
  h$stack = t.stack;
  h$sp = t.sp;



  try {
    c = h$runThreadSlice(c);
    if(c !== h$reschedule) {
      throw new Error("h$runSyncAction: h$reschedule expected");
    }
  } catch(e) {
    h$finishThread(h$currentThread);
    h$currentThread.status = (17);
    caught = true;
    excep = e;
  }
  if(ct !== null) {
    h$currentThread = ct;
    h$stack = ct.stack;
    h$sp = csp;
    h$r1 = cr1;
  } else {
    h$currentThread = null;
    h$stack = null;
  }




  if(t.status !== (16) && !cont) {
    h$removeThreadBlock(t);
    h$finishThread(t);
  }
  if(caught) throw excep;
}

// run other threads synchronously until the blackhole is 'freed'
// returns true for success, false for failure, a thread blocks
function h$runBlackholeThreadSync(bh) {
                                                ;
  var ct = h$currentThread;
  var sp = h$sp;
  var success = false;
  var bhs = [];
  var currentBh = bh;
  // we don't handle async exceptions here,
  // don't run threads with pending exceptions
  if(((bh).d1).excep.length > 0) {
                                                              ;
    return false;
  }
  h$currentThread = ((bh).d1);
  h$stack = h$currentThread.stack;
  h$sp = h$currentThread.sp;



  var c = (h$currentThread.status === (0))?h$stack[h$sp]:h$reschedule;
                                                                                                   ;
  try {
    while(true) {
      while(c !== h$reschedule && (typeof (currentBh) === 'object' && (currentBh) && (currentBh).f && (currentBh).f.t === (5))) {
        c = c();
        c = c();
        c = c();
        c = c();
        c = c();
      }
      if(c === h$reschedule) {
 // perhaps new blackhole, then continue with that thread,
 // otherwise fail
        if((typeof (h$currentThread.blockedOn) === 'object' && (h$currentThread.blockedOn) && (h$currentThread.blockedOn).f && (h$currentThread.blockedOn).f.t === (5))) {
                                                         ;
          bhs.push(currentBh);
          currentBh = h$currentThread.blockedOn;
          h$currentThread = ((h$currentThread.blockedOn).d1);
          if(h$currentThread.excep.length > 0) {
            break;
          }
          h$stack = h$currentThread.stack;
          h$sp = h$currentThread.sp;



          c = (h$currentThread.status === (0))?h$stack[h$sp]:h$reschedule;
        } else {
                                                                                         ;
          break;
        }
      } else { // blackhole updated: suspend thread and pick up the old one
                                                                           ;
                                                ;
        h$suspendCurrentThread(c);
        if(bhs.length > 0) {
                                               ;
          currentBh = bhs.pop();
          h$currentThread = ((currentBh).d1);
          h$stack = h$currentThread.stack;
          h$sp = h$currentThread.sp;



        } else {
                                                             ;
          success = true;
          break;
        }
      }
    }
  } catch(e) { }
  // switch back to original thread
  h$sp = sp;
  h$stack = ct.stack;
  h$currentThread = ct;



  return success;
}

function h$syncThreadState(tid) {
  return (tid.isSynchronous ? 1 : 0) |
    ((tid.continueAsync || !tid.isSynchronous) ? 2 : 0) |
    ((tid.noPreemption || tid.isSynchronous) ? 4 : 0);
}

// run the supplied IO action in a main thread
// (program exits when this thread finishes)
function h$main(a) {
  var t = new h$Thread();



  //TRACE_SCHEDULER("sched: starting main thread");
    t.stack[0] = h$doneMain_e;





  t.stack[4] = h$ap_1_0;
  t.stack[5] = h$flushStdout;
  t.stack[6] = h$return;
  t.stack[7] = h$ap_1_0;
  t.stack[8] = a;
  t.stack[9] = h$return;
  t.sp = 9;
  t.label = [h$encodeUtf8("main"), 0];
  h$wakeupThread(t);
  h$startMainLoop();
  return t;
}

function h$doneMain() {







    h$exitProcess(0);



  h$finishThread(h$currentThread);
  return h$reschedule;
}

/** @constructor */
function h$ThreadAbortedError(code) {
  this.code = code;
}

h$ThreadAbortedError.prototype.toString = function() {
  return "Thread aborted, exit code: " + this.code;
}

function h$exitProcess(code) {
        if(h$currentThread) {
            h$finishThread(h$currentThread);
            h$stack = null;
            throw new h$ThreadAbortedError(code);
        }



}

// MVar support
var h$mvarId = 0;
/** @constructor */
function h$MVar() {
                                       ;
  this.val = null;
  this.readers = new h$Queue();
  this.writers = new h$Queue();
  this.waiters = null; // waiting for a value in the MVar with ReadMVar
  this.m = 0; // gc mark
  this.id = ++h$mvarId;
}

// set the MVar to empty unless there are writers
function h$notifyMVarEmpty(mv) {
  var w = mv.writers.dequeue();
  if(w !== null) {
    var thread = w[0];
    var val = w[1];
                                                                                              ;
    mv.val = val;
    // thread is null if some JavaScript outside Haskell wrote to the MVar
    if(thread !== null) {
      h$wakeupThread(thread);
    }
  } else {
                                                                 ;
    mv.val = null;
  }
                                                              ;
}

// set the MVar to val unless there are readers
function h$notifyMVarFull(mv,val) {
  if(mv.waiters && mv.waiters.length > 0) {
    for(var i=0;i<mv.waiters.length;i++) {
      var w = mv.waiters[i];
                                                                               ;
      w.sp += 2;
      w.stack[w.sp-1] = val;
      w.stack[w.sp] = h$return;
      h$wakeupThread(w);
    }
    mv.waiters = null;
  }
  var r = mv.readers.dequeue();
  if(r !== null) {
                                                                                        ;
    r.sp += 2;
    r.stack[r.sp-1] = val;
    r.stack[r.sp] = h$return;
    h$wakeupThread(r);
    mv.val = null;
  } else {
                                                                ;
    mv.val = val;
  }
                                                             ;
}

function h$takeMVar(mv) {
                                                                                                 ;
  if(mv.val !== null) {
    h$r1 = mv.val;
    h$notifyMVarEmpty(mv);
    return h$stack[h$sp];
  } else {
    mv.readers.enqueue(h$currentThread);
    h$currentThread.interruptible = true;
    return h$blockThread(h$currentThread,mv,[h$takeMVar,mv]);
  }
}

function h$tryTakeMVar(mv) {
                                                            ;
  if(mv.val === null) {
    { h$ret1 = (null); return (0); };
  } else {
    var v = mv.val;
    h$notifyMVarEmpty(mv);
    { h$ret1 = (v); return (1); };
  }
}

function h$readMVar(mv) {
                                                         ;
  if(mv.val === null) {
    if(mv.waiters) {
      mv.waiters.push(h$currentThread);
    } else {
      mv.waiters = [h$currentThread];
    }
    h$currentThread.interruptible = true;
    return h$blockThread(h$currentThread,mv,[h$readMVar,mv]);
  } else {
    h$r1 = mv.val;
    return h$stack[h$sp];
  }
}

function h$putMVar(mv,val) {
                                                        ;
  if(mv.val !== null) {
    mv.writers.enqueue([h$currentThread,val]);
    h$currentThread.interruptible = true;
    return h$blockThread(h$currentThread,mv,[h$putMVar,mv,val]);
  } else {
    h$notifyMVarFull(mv,val);
    return h$stack[h$sp];
  }
}

function h$tryPutMVar(mv,val) {
                                                           ;
  if(mv.val !== null) {
    return 0;
  } else {
    h$notifyMVarFull(mv,val);
    return 1;
  }
}

// box up a JavaScript value and write it to the MVar synchronously
function h$writeMVarJs1(mv,val) {
  var v = (h$c1(h$data1_e, (val)));
  if(mv.val !== null) {
                                               ;
    mv.writers.enqueue([null,v]);
  } else {
                                                ;
    h$notifyMVarFull(mv,v);
  }
}

function h$writeMVarJs2(mv,val1,val2) {
  var v = (h$c2(h$data1_e, (val1), (val2)));
  if(mv.val !== null) {
                                               ;
    mv.writers.enqueue([null,v]);
  } else {
                                                ;
    h$notifyMVarFull(mv,v);
  }
}

// IORef support
/** @constructor */
function h$MutVar(v) {
    this.val = v;
    this.m = 0;
}

function h$atomicModifyMutVar(mv, fun) {
  var thunk = (h$c2(h$ap1_e,(fun),(mv.val)));
  mv.val = (h$c1(h$select1_e, (thunk)));
  return (h$c1(h$select2_e, (thunk)));
}

// Black holes and updates
// caller must save registers on stack
function h$blockOnBlackhole(c) {
                                                              ;
  if(((c).d1) === h$currentThread) {
                                     ;
    return h$throw(h$baseZCControlziExceptionziBasezinonTermination, false); // is this an async exception?
  }
                                                                                   ;
  if(((c).d2) === null) {
    ((c).d2 = ([h$currentThread]));
  } else {
    ((c).d2).push(h$currentThread);
  }
  return h$blockThread(h$currentThread,c,[h$resumeBlockOnBlackhole,c]);
}

function h$resumeBlockOnBlackhole(c) {
  h$r1 = c;
  return h$ap_0_0_fast();
}

// async exception happened in a black hole, make a thunk
// to resume the computation
// var h$debugResumableId = 0;
function h$makeResumable(bh,start,end,extra) {
  var s = h$stack.slice(start,end+1);
  if(extra) {
    s = s.concat(extra);
  }
//  TRACE_SCHEDULER("making resumable " + (h$debugResumableId+1) + ", stack: ");
//  h$dumpStackTop(s,0,s.length-1);
  { (bh).f = h$resume_e; (bh).d1 = (s), (bh).d2 = null; };
}

var h$enabled_capabilities = h$newByteArray(4);
h$enabled_capabilities.i3[0] = 1;

function h$rtsSupportsBoundThreads() {
  return 0;
}

function h$rts_setMainThread(t) {

}

// async foreign calls
function h$mkForeignCallback(x) {
    return function() {
        if(x.mv === null) { // callback called synchronously
            x.mv = arguments;
        } else {
            h$notifyMVarFull(x.mv, (h$c1(h$data1_e, (arguments))));
            h$mainLoop();
        }
    }
}

// event listeners through MVar
function h$makeMVarListener(mv, stopProp, stopImmProp, preventDefault) {
  var f = function(event) {
                                             ;
    h$writeMVarJs1(mv,event);
    if(stopProp) { event.stopPropagation(); }
    if(stopImmProp) { event.stopImmediatePropagation(); }
    if(preventDefault) { event.preventDefault(); }
  }
  f.root = mv;
  return f;
}

function h$rs() {
  return h$stack[h$sp];
}
// software transactional memory
var h$stmTransactionActive = 0;
var h$stmTransactionWaiting = 4;
/** @constructor */
function h$Transaction(o, parent) {
                                                      ;
    this.action = o;
    // h$TVar -> h$WrittenTVar, transaction-local changed values
    this.tvars = new h$Map();
    // h$TVar -> h$LocalTVar, all local tvars accessed anywhere in the transaction
    this.accessed = parent===null?new h$Map():parent.accessed;
    // nonnull while running a check, contains read variables in this part of the transaction
    this.checkRead = parent===null?null:parent.checkRead;
    this.parent = parent;
    this.state = h$stmTransactionActive;
    this.invariants = []; // invariants added in this transaction
    this.m = 0; // gc mark
}

var h$stmInvariantN = 0;
/** @constructor */
function h$StmInvariant(a) {
    this.action = a;
    this._key = ++h$stmInvariantN;
}
/** @constructor */
function h$WrittenTVar(tv,v) {
    this.tvar = tv;
    this.val = v;
}

var h$TVarN = 0;
/** @constructor */
function h$TVar(v) {
                                                           ;
    this.val = v; // current value
    this.blocked = new h$Set(); // threads that get woken up if this TVar is updated
    this.invariants = null; // invariants that use this TVar (h$Set)
    this.m = 0; // gc mark
    this._key = ++h$TVarN; // for storing in h$Map/h$Set
}

/** @constructor */
function h$TVarsWaiting(s) {
  this.tvars = s; // h$Set of TVars we're waiting on
}

/** @constructor */
function h$LocalInvariant(o) {
  this.action = o;
  this.dependencies = new h$Set();
}

// local view of a TVar
/** @constructor */
function h$LocalTVar(v) {
                                                           ;
  this.readVal = v.val; // the value when read from environment
  this.val = v.val; // the current uncommitted value
  this.tvar = v;
}

function h$atomically(o) {
  h$p3(o, h$atomically_e, h$checkInvariants_e);
  return h$stmStartTransaction(o);
}

function h$stmStartTransaction(o) {
                                                         ;
  var t = new h$Transaction(o, null);
  h$currentThread.transaction = t;
  h$r1 = o;
  return h$ap_1_0_fast();
}

function h$stmUpdateInvariantDependencies(inv) {
    var ii, iter = h$currentThread.transaction.checkRead.iter();
    if(inv instanceof h$LocalInvariant) {
        while((ii = iter.next()) !== null) inv.dependencies.add(ii);
    } else {
        while((ii = iter.next()) !== null) h$stmAddTVarInvariant(ii, inv);
    }
}

function h$stmAddTVarInvariant(tv, inv) {
    if(tv.invariants === null) tv.invariants = new h$Set();
    tv.invariants.add(inv);
}

// commit current transaction,
// if it's top-level, commit the TVars, otherwise commit to parent
function h$stmCommitTransaction() {
    var t = h$currentThread.transaction;
    var tvs = t.tvars;
    var wtv, i = tvs.iter();
    if(t.parent === null) { // top-level commit
                                                     ;
 // write new value to TVars and collect blocked threads
        var thread, threadi, blockedThreads = new h$Set();
        while((wtv = i.nextVal()) !== null) {
     h$stmCommitTVar(wtv.tvar, wtv.val, blockedThreads);
 }
 // wake up all blocked threads
        threadi = blockedThreads.iter();
        while((thread = threadi.next()) !== null) {
     h$stmRemoveBlockedThread(thread.blockedOn, thread);
            h$wakeupThread(thread);
 }
 // commit our new invariants
        for(var j=0;j<t.invariants.length;j++) {
            h$stmCommitInvariant(t.invariants[j]);
        }
    } else { // commit subtransaction
                                              ;
        var tpvs = t.parent.tvars;
        while((wtv = i.nextVal()) !== null) tpvs.put(wtv.tvar, wtv);
        t.parent.invariants = t.parent.invariants.concat(t.invariants);
    }
    h$currentThread.transaction = t.parent;
}

function h$stmValidateTransaction() {
    var ltv, i = h$currentThread.transaction.accessed.iter();
    while((ltv = i.nextVal()) !== null) {
        if(ltv.readVal !== ltv.tvar.val) return false;
    }
    return true;
}

function h$stmAbortTransaction() {
  h$currentThread.transaction = h$currentThread.transaction.parent;
}


// add an invariant
function h$stmCheck(o) {
  h$currentThread.transaction.invariants.push(new h$LocalInvariant(o));
  return false;
}

function h$stmRetry() {
  // unwind stack to h$atomically_e or h$stmCatchRetry_e frame
  while(h$sp > 0) {
    var f = h$stack[h$sp];
    if(f === h$atomically_e || f === h$stmCatchRetry_e) {
      break;
    }
    var size;
    if(f === h$ap_gen) {
      size = ((h$stack[h$sp-1] >> 8) + 2);
    } else {
      var tag = f.gtag;
      if(tag < 0) { // dynamic size
        size = h$stack[h$sp-1];
      } else {
        size = (tag & 0xff) + 1;
      }
    }
    h$sp -= size;
  }
  // either h$sp == 0 or at a handler
  if(h$sp > 0) {
    if(f === h$atomically_e) {
      return h$stmSuspendRetry();
    } else { // h$stmCatchRetry_e
      var b = h$stack[h$sp-1];
      h$stmAbortTransaction();
      h$sp -= 2;
      h$r1 = b;
      return h$ap_1_0_fast();
    }
  } else {
    throw "h$stmRetry: STM retry outside a transaction";
  }
}

function h$stmSuspendRetry() {
    var tv, i = h$currentThread.transaction.accessed.iter();
    var tvs = new h$Set();
    while((tv = i.next()) !== null) {
                                                                       ;
        tv.blocked.add(h$currentThread);
        tvs.add(tv);
    }
    var waiting = new h$TVarsWaiting(tvs);
    h$currentThread.interruptible = true;
    h$p2(waiting, h$stmResumeRetry_e);
    return h$blockThread(h$currentThread, waiting);
}

function h$stmCatchRetry(a,b) {
    h$currentThread.transaction = new h$Transaction(b, h$currentThread.transaction);
    h$p2(b, h$stmCatchRetry_e);
    h$r1 = a;
    return h$ap_1_0_fast();
}

function h$catchStm(a,handler) {
    h$p4(h$currentThread.transaction, h$currentThread.mask, handler, h$catchStm_e);
    h$r1 = a;
    return h$ap_1_0_fast();
}

function h$newTVar(v) {
  return new h$TVar(v);
}

function h$readTVar(tv) {
  return h$readLocalTVar(h$currentThread.transaction,tv);
}

function h$readTVarIO(tv) {
  return tv.val;
}

function h$writeTVar(tv, v) {
  h$setLocalTVar(h$currentThread.transaction, tv, v);
}

function h$sameTVar(tv1, tv2) {
  return tv1 === tv2;
}

// get the local value of the TVar in the transaction t
// tvar is added to the read set
function h$readLocalTVar(t, tv) {
  if(t.checkRead !== null) {
    t.checkRead.add(tv);
  }
  var t0 = t;
  while(t0 !== null) {
    var v = t0.tvars.get(tv);
    if(v !== null) {
                                                                                      ;
      return v.val;
    }
    t0 = t0.parent;
  }
  var lv = t.accessed.get(tv);
  if(lv !== null) {
                                                                         ;
    return lv.val;
  } else {
                                                                                     ;
    t.accessed.put(tv, new h$LocalTVar(tv));
    return tv.val;
  }
}

function h$setLocalTVar(t, tv, v) {
    if(!t.accessed.has(tv)) t.accessed.put(tv, new h$LocalTVar(tv));
    if(t.tvars.has(tv)) {
        t.tvars.get(tv).val = v;
    } else {
        t.tvars.put(tv, new h$WrittenTVar(tv, v));
    }
}

function h$stmCheckInvariants() {
    var t = h$currentThread.transaction;
    function addCheck(inv) {
        h$p5(inv, h$stmCheckInvariantResult_e, t, inv, h$stmCheckInvariantStart_e);
    }
    h$p2(h$r1, h$return);
    var wtv, i = t.tvars.iter();
    while((wtv = i.nextVal()) !== null) {
                                                                           ;
        var ii = wtv.tvar.invariants;
        if(ii) {
            var iv, iii = ii.iter();
            while((iv = iii.next()) !== null) addCheck(iv);
        }
    }
    for(var j=0;j<t.invariants.length;j++) {
        addCheck(t.invariants[j]);
    }
    return h$stack[h$sp];
}

function h$stmCommitTVar(tv, v, threads) {
                                                                   ;
    if(v !== tv.val) {
        var thr, iter = tv.blocked.iter();
        while((thr = iter.next()) !== null) threads.add(thr);
        tv.blocked.clear();
        tv.val = v;
    }
}

// remove the thread from the queues of the TVars in s
function h$stmRemoveBlockedThread(s, thread) {
    var tv, i = s.tvars.iter();
    while((tv = i.next()) !== null) {
        tv.blocked.remove(thread);
    }
}

function h$stmCommitInvariant(localInv) {
    var inv = new h$StmInvariant(localInv.action);
    var dep, i = localInv.dependencies.iter();
    while((dep = i.next()) !== null) {
        h$stmAddTVarInvariant(dep, inv);
    }
}






// values defined in Gen2.ClosureInfo







// thread status

/*
 * low-level heap object manipulation macros
 */
// GHCJS.Prim.JSVal







// GHCJS.Prim.JSException





// Exception dictionary for JSException


// SomeException






// GHC.Ptr.Ptr






// GHC.Integer.GMP.Internals
// Data.Maybe.Maybe




// #define HS_NOTHING h$nothing






// Data.List
// Data.Text




// Data.Text.Lazy





// black holes
// can we skip the indirection for black holes?






// resumable thunks


// general deconstruction



// retrieve  a numeric value that's possibly stored as an indirection



// generic lazy values
// generic data constructors and selectors
// unboxed tuple returns
// #define RETURN_UBX_TUP1(x) return x;

// static pointers
var h$static_pointer_table = null;
var h$static_pointer_table_keys = null;

function h$hs_spt_insert(key1,key2,key3,key4,ref) {
    //  h$log("hs_spt_insert: " + key1 + " " + key2 + " " + key3 + " " + key4 + " -> " + h$collectProps(ref));
    if(!h$static_pointer_table) {
 h$static_pointer_table = [];
 h$static_pointer_table_keys = [];
    }
    if(!h$hs_spt_lookup_key(key1,key2,key3,key4)) {
        var ba = h$newByteArray(16);
        ba.i3[0] = key2;
        ba.i3[1] = key1;
        ba.i3[2] = key4;
        ba.i3[3] = key3;
 h$static_pointer_table_keys.push([ba,0]);
        h$retain({ root: ref, _key: -1 });
    }
    var s = h$static_pointer_table;
    if(!s[key1]) s[key1] = [];
    if(!s[key1][key2]) s[key1][key2] = [];
    if(!s[key1][key2][key3]) s[key1][key2][key3] = [];
    s[key1][key2][key3][key4] = ref;
}

function h$hs_spt_key_count() {
    return h$static_pointer_table_keys ?
              h$static_pointer_table_keys.length : 0;
}

function h$hs_spt_keys(tgt_d, tgt_o, n) {
    var ks = h$static_pointer_table_keys;
    if(!tgt_d.arr) tgt_d.arr = [];
    for(var i=0;(i<n&&i<ks.length);i++) tgt_d.arr[tgt_o+4*i] = ks[i];
    return Math.min(n,ks.length);
}

function h$hs_spt_lookup(key_d, key_o) {
    var i3 = key_d.i3, o = key_o >> 2;
    // h$log("hs_spt_lookup");
    { h$ret1 = (0); return (h$hs_spt_lookup_key(i3[o+1],i3[o],i3[o+3],i3[o+2])); };
}

function h$hs_spt_lookup_key(key1,key2,key3,key4) {
    // h$log("hs_spt_lookup_key: " + key1 + " " + key2 + " " + key3 + " " + key4);
    var s = h$static_pointer_table;
    if(s && s[key1] && s[key1][key2] && s[key1][key2][key3] &&
       s[key1][key2][key3][key4]) return s[key1][key2][key3][key4];
    return null;
}
/*
  Stable pointers are all allocated in the h$StablePtrData buffer and
  can therefore be distinguished by offset

  StablePtr# is treated as Word32# when it comes to writing and reading them
 */
var h$stablePtrData = [null];
var h$stablePtrBuf = h$newByteArray(8);
var h$stablePtrN = 1;
var h$stablePtrFree = [];

function h$makeStablePtr(v) {
                                  ;
  if(!v) return 0;
  var slot = h$stablePtrFree.pop();
  if(slot === undefined) {
    slot = h$stablePtrN++;
  }
                                      ;
  h$stablePtrData[slot] = v;
  return slot << 2;
}

function h$deRefStablePtr(stable_o) {
  var slot = stable_o >> 2;
  return h$stablePtrData[slot];
}

function h$hs_free_stable_ptr(stable_d, stable_o) {
  var slot = stable_o >> 2;
                                       ;
  if(h$stablePtrData[slot] !== null) {
    h$stablePtrData[slot] = null;
    h$stablePtrFree.push(slot);
  }
}

// not strictly stableptr, but we make it work only for stable pointers
function h$addrToAny(addr_v, addr_o) {
                              ;
                                            ;
  var slot = addr_o >> 2;
  return h$stablePtrData[slot];
}






// values defined in Gen2.ClosureInfo







// thread status

/*
 * low-level heap object manipulation macros
 */
// GHCJS.Prim.JSVal







// GHCJS.Prim.JSException





// Exception dictionary for JSException


// SomeException






// GHC.Ptr.Ptr






// GHC.Integer.GMP.Internals
// Data.Maybe.Maybe




// #define HS_NOTHING h$nothing






// Data.List
// Data.Text




// Data.Text.Lazy





// black holes
// can we skip the indirection for black holes?






// resumable thunks


// general deconstruction



// retrieve  a numeric value that's possibly stored as an indirection



// generic lazy values
// generic data constructors and selectors
// unboxed tuple returns
// #define RETURN_UBX_TUP1(x) return x;








function h$__hscore_sizeof_termios() {
                                         ;
    return 4;
}

function h$tcgetattr(x, y, z) {
                                                       ;
    return 0;
}

function h$__hscore_get_saved_termios(r) {
                                                  ;
    { h$ret1 = (0); return (null); };
}

function h$__hscore_set_saved_termios(a, b, c) {
                                                                      ;
    { h$ret1 = (0); return (null); };
}

function h$__hscore_sizeof_sigset_t() {
                                          ;
    return 4;
}

function h$sigemptyset(a, b) {
                                               ;
    { h$ret1 = (0); return (null); };
}

function h$__hscore_sigttou() {
                                  ;
    return 0;
}

function h$sigaddset(a, b, c) {
                                                       ;
    return 0;
}

function h$__hscore_sig_block() {
                                    ;
    return 0;
}

function h$sigprocmask(a,b,c,d,e) {
                                                                             ;
    { h$ret1 = (0); return (0); };
}

function h$__hscore_lflag(a,b) {
                                                ;
    return 0;
}

function h$__hscore_icanon() {
                                 ;
    return 0;
}

function h$__hscore_poke_lflag(a, b, c) {
                                                               ;
    return 0;
}

function h$__hscore_ptr_c_cc(a, b) {
                                                   ;
    { h$ret1 = (0); return (h$newByteArray(8)); }; // null;
}

function h$__hscore_vmin() {
                               ;
    { h$ret1 = (0); return (h$newByteArray(8)); }; // null;
}

function h$__hscore_vtime() {
                                ;
    return 0;
}

function h$__hscore_tcsanow() {
                                  ;
    return 0;
}

function h$tcsetattr(a,b,c,d) {
                                                                 ;
    return 0;
}

function h$__hscore_sig_setmask() {
                                      ;
    return 0;
}
/*
   Runtime inspection of Haskell data.

   The code generator can emit calls to these functions
 */
/*
function h$verify_rep_int64(x, y) {

}

function h$verify_rep_word64(x, y) {

}
*/

/*
  an int rep is an integer in range [-2^31..2^31-1]
    (for Word# values, the value is treated as unsigned by the RTS. From
     JavaScript it still looks signed.
    )
 */
function h$verify_rep_int(x) {
  if(typeof x === 'number' &&
     (x|0) === x
    ) return;
  throw new Error("invalid int rep " + h$show_val(x));
}

/*
function h$verify_rep_word(x, y) {

}
*/
/*
   a long rep is two integers in rage [-2^31..2^31-1]
 */
function h$verify_rep_long(x, y) {
  if(typeof x === 'number' &&
     typeof y === 'number' &&
     (x|0) === x &&
     (y|0) === y
    ) return;
  throw new Error("invalid long rep " + h$show_val(x) + " " + h$show_val(y));
}

/*
function h$verify_rep_float(x) {

}
*/

function h$verify_rep_double(x) {
  if(typeof x === 'number') return;
  throw new Error("invalid double rep " + h$show_val(x));
}

/*
  an array rep is a JavaScript array. The elements are other
  array reps or heap objects.
 */
function h$verify_rep_arr(x) {
  if(h$verify_rep_is_arr(x)) return;
  throw new Error("invalid array rep " + h$show_val(x));
}

function h$verify_rep_is_arr(x) {
  // XXX check the elements?
  return (typeof x === 'object'
          && x
          && Array.isArray(x)
          // XXX enable this check
          // && x.__ghcjsArray === true
        );
}

function h$verify_rep_rtsobj(x) {
  // unspecified unlifted value
}

/*
  an rts object rep is one of the known RTS object types
 */
function h$verify_rep_is_rtsobj(o) {
 return (o instanceof h$MVar ||
         o instanceof h$MutVar ||
         o instanceof h$TVar ||
         o instanceof h$Transaction ||
         o instanceof h$Thread ||
         o instanceof h$Weak ||
         o instanceof h$StableName ||
         h$verify_rep_is_bytearray(o) ||
         h$verify_rep_is_arr(o));
}

function h$verify_rep_is_bytearray(o) {
  return (typeof o === 'object' &&
          o &&
          typeof o.buf === 'object' &&
          o.buf &&
          o.buf instanceof ArrayBuffer &&
          typeof o.len === 'number');
}

/*
  a heap object rep is either an object or an unboxed heap object

  unboxed heap objects store evaluated values of type 'number' or 'boolean'
  without wrapping them in a normal heap object. this is only done for
  data types with a single constructor and a single field of an appropriate type
 */
function h$verify_rep_heapobj(o) {
  // possibly an unlifted rts object
  // XXX: we should do a different check for these
  if(h$verify_rep_is_rtsobj(o)) return;
  // unboxed rep
  if(typeof o === 'number' || typeof o === 'boolean') return;
  // boxed rep
  if(typeof o === 'object' &&
     o &&
     typeof o.f === 'function' &&
     typeof o.f.a === 'number' &&
     (typeof o.m === 'number' || (typeof o.m === 'object' && o.m))
   ) return;
  throw new Error("invalid heapobj rep " + h$show_val(o));
}

/*
   an addr rep is a data object and an integer offset
 */
function h$verify_rep_addr(v, o) {
  if(typeof o === 'number' &&
     (o|0) === o &&
     // o        >=  0        && // XXX we could treat it as unsigned, should we?
     typeof v === 'object'
    ) return;
  throw new Error("invalid addr rep " + h$show_val(v) + " " + o);
}

/*
   v must be a value of type tc that can be matched
 */
function h$verify_match_alg(tc, v) {
  if(typeof v === 'boolean') {
    if(tc === "ghc-prim:GHC.Types.Bool") return;
    throw new Error("invalid pattern match boolean rep " + tc);
  } else if(typeof v === 'number') {
    // h$log("h$verify_match_alg number: " + tc);
    return;
  } else if(typeof v === 'object') {
    // h$log("verify_match_alg_obj: " + tc);
    if(!(typeof v.f === 'function' &&
         typeof v.f.a === 'number' &&
         typeof v.f.t === 'number' &&
         v.f.t === 2 /// con
       )) {
         throw new Error("not a data constructor " + tc + ": " + h$show_val(v));
    }
    // XXX add check for the type
    return;
  }
  throw new Error("invalid pattern match rep " + tc + ": " + h$show_val(v));
}

/*
   debug show object
 */

function h$show_val(o) {
  if(typeof o === 'undefined') return '<undefined>'
  if(o === null) return '<null>'
  if(typeof o !== 'object') return '[' + (typeof o) + ': ' + o + ']'
  return '' + o + ' [' + o.constructor.name + '] ' + h$collectProps(o);
}
function h$c(f)
{
  var h$RTS_0 = { d1: null, d2: null, f: f, m: 0
                };
  return h$RTS_0;
};
function h$c0(f)
{
  var h$RTS_1 = { d1: null, d2: null, f: f, m: 0
                };
  return h$RTS_1;
};
function h$c1(f, x1)
{
  var h$RTS_2 = { d1: x1, d2: null, f: f, m: 0
                };
  return h$RTS_2;
};
function h$c2(f, x1, x2)
{
  var h$RTS_3 = { d1: x1, d2: x2, f: f, m: 0
                };
  return h$RTS_3;
};
function h$c3(f, x1, x2, x3)
{
  var h$RTS_4 = { d1: x1, d2: { d1: x2, d2: x3
                              }, f: f, m: 0
                };
  return h$RTS_4;
};
function h$c4(f, x1, x2, x3, x4)
{
  var h$RTS_5 = { d1: x1, d2: { d1: x2, d2: x3, d3: x4
                              }, f: f, m: 0
                };
  return h$RTS_5;
};
function h$c5(f, x1, x2, x3, x4, x5)
{
  var h$RTS_6 = { d1: x1, d2: { d1: x2, d2: x3, d3: x4, d4: x5
                              }, f: f, m: 0
                };
  return h$RTS_6;
};
function h$c6(f, x1, x2, x3, x4, x5, x6)
{
  var h$RTS_7 = { d1: x1, d2: { d1: x2, d2: x3, d3: x4, d4: x5, d5: x6
                              }, f: f, m: 0
                };
  return h$RTS_7;
};
function h$c7(f, x1, x2, x3, x4, x5, x6, x7)
{
  var h$RTS_8 = { d1: x1, d2: { d1: x2, d2: x3, d3: x4, d4: x5, d5: x6, d6: x7
                              }, f: f, m: 0
                };
  return h$RTS_8;
};
function h$c8(f, x1, x2, x3, x4, x5, x6, x7, x8)
{
  var h$RTS_9 = { d1: x1, d2: { d1: x2, d2: x3, d3: x4, d4: x5, d5: x6, d6: x7, d7: x8
                              }, f: f, m: 0
                };
  return h$RTS_9;
};
function h$c9(f, x1, x2, x3, x4, x5, x6, x7, x8, x9)
{
  var h$RTS_10 = { d1: x1, d2: { d1: x2, d2: x3, d3: x4, d4: x5, d5: x6, d6: x7, d7: x8, d8: x9
                               }, f: f, m: 0
                 };
  return h$RTS_10;
};
function h$c10(f, x1, x2, x3, x4, x5, x6, x7, x8, x9, x10)
{
  var h$RTS_11 = { d1: x1, d2: { d1: x2, d2: x3, d3: x4, d4: x5, d5: x6, d6: x7, d7: x8, d8: x9, d9: x10
                               }, f: f, m: 0
                 };
  return h$RTS_11;
};
function h$c11(f, x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11)
{
  var h$RTS_12 = { d1: x1, d2: { d1: x2, d10: x11, d2: x3, d3: x4, d4: x5, d5: x6, d6: x7, d7: x8, d8: x9, d9: x10
                               }, f: f, m: 0
                 };
  return h$RTS_12;
};
function h$c12(f, x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12)
{
  var h$RTS_13 = { d1: x1, d2: { d1: x2, d10: x11, d11: x12, d2: x3, d3: x4, d4: x5, d5: x6, d6: x7, d7: x8, d8: x9,
                                 d9: x10
                               }, f: f, m: 0
                 };
  return h$RTS_13;
};
function h$c13(f, x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13)
{
  var h$RTS_14 = { d1: x1, d2: { d1: x2, d10: x11, d11: x12, d12: x13, d2: x3, d3: x4, d4: x5, d5: x6, d6: x7, d7: x8,
                                 d8: x9, d9: x10
                               }, f: f, m: 0
                 };
  return h$RTS_14;
};
function h$c14(f, x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14)
{
  var h$RTS_15 = { d1: x1, d2: { d1: x2, d10: x11, d11: x12, d12: x13, d13: x14, d2: x3, d3: x4, d4: x5, d5: x6, d6: x7,
                                 d7: x8, d8: x9, d9: x10
                               }, f: f, m: 0
                 };
  return h$RTS_15;
};
function h$c15(f, x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15)
{
  var h$RTS_16 = { d1: x1, d2: { d1: x2, d10: x11, d11: x12, d12: x13, d13: x14, d14: x15, d2: x3, d3: x4, d4: x5, d5: x6,
                                 d6: x7, d7: x8, d8: x9, d9: x10
                               }, f: f, m: 0
                 };
  return h$RTS_16;
};
function h$c16(f, x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15, x16)
{
  var h$RTS_17 = { d1: x1, d2: { d1: x2, d10: x11, d11: x12, d12: x13, d13: x14, d14: x15, d15: x16, d2: x3, d3: x4,
                                 d4: x5, d5: x6, d6: x7, d7: x8, d8: x9, d9: x10
                               }, f: f, m: 0
                 };
  return h$RTS_17;
};
function h$c17(f, x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15, x16, x17)
{
  var h$RTS_18 = { d1: x1, d2: { d1: x2, d10: x11, d11: x12, d12: x13, d13: x14, d14: x15, d15: x16, d16: x17, d2: x3,
                                 d3: x4, d4: x5, d5: x6, d6: x7, d7: x8, d8: x9, d9: x10
                               }, f: f, m: 0
                 };
  return h$RTS_18;
};
function h$c18(f, x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15, x16, x17, x18)
{
  var h$RTS_19 = { d1: x1, d2: { d1: x2, d10: x11, d11: x12, d12: x13, d13: x14, d14: x15, d15: x16, d16: x17, d17: x18,
                                 d2: x3, d3: x4, d4: x5, d5: x6, d6: x7, d7: x8, d8: x9, d9: x10
                               }, f: f, m: 0
                 };
  return h$RTS_19;
};
function h$c19(f, x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15, x16, x17, x18, x19)
{
  var h$RTS_20 = { d1: x1, d2: { d1: x2, d10: x11, d11: x12, d12: x13, d13: x14, d14: x15, d15: x16, d16: x17, d17: x18,
                                 d18: x19, d2: x3, d3: x4, d4: x5, d5: x6, d6: x7, d7: x8, d8: x9, d9: x10
                               }, f: f, m: 0
                 };
  return h$RTS_20;
};
function h$c20(f, x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15, x16, x17, x18, x19, x20)
{
  var h$RTS_21 = { d1: x1, d2: { d1: x2, d10: x11, d11: x12, d12: x13, d13: x14, d14: x15, d15: x16, d16: x17, d17: x18,
                                 d18: x19, d19: x20, d2: x3, d3: x4, d4: x5, d5: x6, d6: x7, d7: x8, d8: x9, d9: x10
                               }, f: f, m: 0
                 };
  return h$RTS_21;
};
function h$c21(f, x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15, x16, x17, x18, x19, x20, x21)
{
  var h$RTS_22 = { d1: x1, d2: { d1: x2, d10: x11, d11: x12, d12: x13, d13: x14, d14: x15, d15: x16, d16: x17, d17: x18,
                                 d18: x19, d19: x20, d2: x3, d20: x21, d3: x4, d4: x5, d5: x6, d6: x7, d7: x8, d8: x9, d9: x10
                               }, f: f, m: 0
                 };
  return h$RTS_22;
};
function h$c22(f, x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15, x16, x17, x18, x19, x20, x21, x22)
{
  var h$RTS_23 = { d1: x1, d2: { d1: x2, d10: x11, d11: x12, d12: x13, d13: x14, d14: x15, d15: x16, d16: x17, d17: x18,
                                 d18: x19, d19: x20, d2: x3, d20: x21, d21: x22, d3: x4, d4: x5, d5: x6, d6: x7, d7: x8, d8: x9, d9: x10
                               }, f: f, m: 0
                 };
  return h$RTS_23;
};
function h$c23(f, x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15, x16, x17, x18, x19, x20, x21, x22,
x23)
{
  var h$RTS_24 = { d1: x1, d2: { d1: x2, d10: x11, d11: x12, d12: x13, d13: x14, d14: x15, d15: x16, d16: x17, d17: x18,
                                 d18: x19, d19: x20, d2: x3, d20: x21, d21: x22, d22: x23, d3: x4, d4: x5, d5: x6, d6: x7, d7: x8, d8: x9, d9: x10
                               }, f: f, m: 0
                 };
  return h$RTS_24;
};
function h$c24(f, x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15, x16, x17, x18, x19, x20, x21, x22,
x23, x24)
{
  var h$RTS_25 = { d1: x1, d2: { d1: x2, d10: x11, d11: x12, d12: x13, d13: x14, d14: x15, d15: x16, d16: x17, d17: x18,
                                 d18: x19, d19: x20, d2: x3, d20: x21, d21: x22, d22: x23, d23: x24, d3: x4, d4: x5, d5: x6, d6: x7, d7: x8, d8: x9,
                                 d9: x10
                               }, f: f, m: 0
                 };
  return h$RTS_25;
};
function h$d1(d1)
{
  return { d1: d1
         };
};
function h$d2(d1, d2)
{
  return { d1: d1, d2: d2
         };
};
function h$d3(d1, d2, d3)
{
  return { d1: d1, d2: d2, d3: d3
         };
};
function h$d4(d1, d2, d3, d4)
{
  return { d1: d1, d2: d2, d3: d3, d4: d4
         };
};
function h$d5(d1, d2, d3, d4, d5)
{
  return { d1: d1, d2: d2, d3: d3, d4: d4, d5: d5
         };
};
function h$d6(d1, d2, d3, d4, d5, d6)
{
  return { d1: d1, d2: d2, d3: d3, d4: d4, d5: d5, d6: d6
         };
};
function h$d7(d1, d2, d3, d4, d5, d6, d7)
{
  return { d1: d1, d2: d2, d3: d3, d4: d4, d5: d5, d6: d6, d7: d7
         };
};
function h$d8(d1, d2, d3, d4, d5, d6, d7, d8)
{
  return { d1: d1, d2: d2, d3: d3, d4: d4, d5: d5, d6: d6, d7: d7, d8: d8
         };
};
function h$d9(d1, d2, d3, d4, d5, d6, d7, d8, d9)
{
  return { d1: d1, d2: d2, d3: d3, d4: d4, d5: d5, d6: d6, d7: d7, d8: d8, d9: d9
         };
};
function h$d10(d1, d2, d3, d4, d5, d6, d7, d8, d9, d10)
{
  return { d1: d1, d10: d10, d2: d2, d3: d3, d4: d4, d5: d5, d6: d6, d7: d7, d8: d8, d9: d9
         };
};
function h$d11(d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11)
{
  return { d1: d1, d10: d10, d11: d11, d2: d2, d3: d3, d4: d4, d5: d5, d6: d6, d7: d7, d8: d8, d9: d9
         };
};
function h$d12(d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11, d12)
{
  return { d1: d1, d10: d10, d11: d11, d12: d12, d2: d2, d3: d3, d4: d4, d5: d5, d6: d6, d7: d7, d8: d8, d9: d9
         };
};
function h$d13(d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11, d12, d13)
{
  return { d1: d1, d10: d10, d11: d11, d12: d12, d13: d13, d2: d2, d3: d3, d4: d4, d5: d5, d6: d6, d7: d7, d8: d8, d9: d9
         };
};
function h$d14(d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11, d12, d13, d14)
{
  return { d1: d1, d10: d10, d11: d11, d12: d12, d13: d13, d14: d14, d2: d2, d3: d3, d4: d4, d5: d5, d6: d6, d7: d7,
           d8: d8, d9: d9
         };
};
function h$d15(d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11, d12, d13, d14, d15)
{
  return { d1: d1, d10: d10, d11: d11, d12: d12, d13: d13, d14: d14, d15: d15, d2: d2, d3: d3, d4: d4, d5: d5, d6: d6,
           d7: d7, d8: d8, d9: d9
         };
};
function h$d16(d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11, d12, d13, d14, d15, d16)
{
  return { d1: d1, d10: d10, d11: d11, d12: d12, d13: d13, d14: d14, d15: d15, d16: d16, d2: d2, d3: d3, d4: d4, d5: d5,
           d6: d6, d7: d7, d8: d8, d9: d9
         };
};
function h$d17(d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11, d12, d13, d14, d15, d16, d17)
{
  return { d1: d1, d10: d10, d11: d11, d12: d12, d13: d13, d14: d14, d15: d15, d16: d16, d17: d17, d2: d2, d3: d3, d4: d4,
           d5: d5, d6: d6, d7: d7, d8: d8, d9: d9
         };
};
function h$d18(d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11, d12, d13, d14, d15, d16, d17, d18)
{
  return { d1: d1, d10: d10, d11: d11, d12: d12, d13: d13, d14: d14, d15: d15, d16: d16, d17: d17, d18: d18, d2: d2,
           d3: d3, d4: d4, d5: d5, d6: d6, d7: d7, d8: d8, d9: d9
         };
};
function h$d19(d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11, d12, d13, d14, d15, d16, d17, d18, d19)
{
  return { d1: d1, d10: d10, d11: d11, d12: d12, d13: d13, d14: d14, d15: d15, d16: d16, d17: d17, d18: d18, d19: d19,
           d2: d2, d3: d3, d4: d4, d5: d5, d6: d6, d7: d7, d8: d8, d9: d9
         };
};
function h$d20(d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11, d12, d13, d14, d15, d16, d17, d18, d19, d20)
{
  return { d1: d1, d10: d10, d11: d11, d12: d12, d13: d13, d14: d14, d15: d15, d16: d16, d17: d17, d18: d18, d19: d19,
           d2: d2, d20: d20, d3: d3, d4: d4, d5: d5, d6: d6, d7: d7, d8: d8, d9: d9
         };
};
function h$d21(d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11, d12, d13, d14, d15, d16, d17, d18, d19, d20, d21)
{
  return { d1: d1, d10: d10, d11: d11, d12: d12, d13: d13, d14: d14, d15: d15, d16: d16, d17: d17, d18: d18, d19: d19,
           d2: d2, d20: d20, d21: d21, d3: d3, d4: d4, d5: d5, d6: d6, d7: d7, d8: d8, d9: d9
         };
};
function h$d22(d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11, d12, d13, d14, d15, d16, d17, d18, d19, d20, d21, d22)
{
  return { d1: d1, d10: d10, d11: d11, d12: d12, d13: d13, d14: d14, d15: d15, d16: d16, d17: d17, d18: d18, d19: d19,
           d2: d2, d20: d20, d21: d21, d22: d22, d3: d3, d4: d4, d5: d5, d6: d6, d7: d7, d8: d8, d9: d9
         };
};
function h$d23(d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11, d12, d13, d14, d15, d16, d17, d18, d19, d20, d21, d22, d23)
{
  return { d1: d1, d10: d10, d11: d11, d12: d12, d13: d13, d14: d14, d15: d15, d16: d16, d17: d17, d18: d18, d19: d19,
           d2: d2, d20: d20, d21: d21, d22: d22, d23: d23, d3: d3, d4: d4, d5: d5, d6: d6, d7: d7, d8: d8, d9: d9
         };
};
function h$d24(d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11, d12, d13, d14, d15, d16, d17, d18, d19, d20, d21, d22, d23,
d24)
{
  return { d1: d1, d10: d10, d11: d11, d12: d12, d13: d13, d14: d14, d15: d15, d16: d16, d17: d17, d18: d18, d19: d19,
           d2: d2, d20: d20, d21: d21, d22: d22, d23: d23, d24: d24, d3: d3, d4: d4, d5: d5, d6: d6, d7: d7, d8: d8, d9: d9
         };
};
function h$resetRegisters()
{
  h$r1 = null;
  h$r2 = null;
  h$r3 = null;
  h$r4 = null;
  h$r5 = null;
  h$r6 = null;
  h$r7 = null;
  h$r8 = null;
  h$r9 = null;
  h$r10 = null;
  h$r11 = null;
  h$r12 = null;
  h$r13 = null;
  h$r14 = null;
  h$r15 = null;
  h$r16 = null;
  h$r17 = null;
  h$r18 = null;
  h$r19 = null;
  h$r20 = null;
  h$r21 = null;
  h$r22 = null;
  h$r23 = null;
  h$r24 = null;
  h$r25 = null;
  h$r26 = null;
  h$r27 = null;
  h$r28 = null;
  h$r29 = null;
  h$r30 = null;
  h$r31 = null;
  h$r32 = null;
  h$regs[0] = null;
  h$regs[1] = null;
  h$regs[2] = null;
  h$regs[3] = null;
  h$regs[4] = null;
  h$regs[5] = null;
  h$regs[6] = null;
  h$regs[7] = null;
  h$regs[8] = null;
  h$regs[9] = null;
  h$regs[10] = null;
  h$regs[11] = null;
  h$regs[12] = null;
  h$regs[13] = null;
  h$regs[14] = null;
  h$regs[15] = null;
  h$regs[16] = null;
  h$regs[17] = null;
  h$regs[18] = null;
  h$regs[19] = null;
  h$regs[20] = null;
  h$regs[21] = null;
  h$regs[22] = null;
  h$regs[23] = null;
  h$regs[24] = null;
  h$regs[25] = null;
  h$regs[26] = null;
  h$regs[27] = null;
  h$regs[28] = null;
  h$regs[29] = null;
  h$regs[30] = null;
  h$regs[31] = null;
  h$regs[32] = null;
  h$regs[33] = null;
  h$regs[34] = null;
  h$regs[35] = null;
  h$regs[36] = null;
  h$regs[37] = null;
  h$regs[38] = null;
  h$regs[39] = null;
  h$regs[40] = null;
  h$regs[41] = null;
  h$regs[42] = null;
  h$regs[43] = null;
  h$regs[44] = null;
  h$regs[45] = null;
  h$regs[46] = null;
  h$regs[47] = null;
  h$regs[48] = null;
  h$regs[49] = null;
  h$regs[50] = null;
  h$regs[51] = null;
  h$regs[52] = null;
  h$regs[53] = null;
  h$regs[54] = null;
  h$regs[55] = null;
  h$regs[56] = null;
  h$regs[57] = null;
  h$regs[58] = null;
  h$regs[59] = null;
  h$regs[60] = null;
  h$regs[61] = null;
  h$regs[62] = null;
  h$regs[63] = null;
  h$regs[64] = null;
  h$regs[65] = null;
  h$regs[66] = null;
  h$regs[67] = null;
  h$regs[68] = null;
  h$regs[69] = null;
  h$regs[70] = null;
  h$regs[71] = null;
  h$regs[72] = null;
  h$regs[73] = null;
  h$regs[74] = null;
  h$regs[75] = null;
  h$regs[76] = null;
  h$regs[77] = null;
  h$regs[78] = null;
  h$regs[79] = null;
  h$regs[80] = null;
  h$regs[81] = null;
  h$regs[82] = null;
  h$regs[83] = null;
  h$regs[84] = null;
  h$regs[85] = null;
  h$regs[86] = null;
  h$regs[87] = null;
  h$regs[88] = null;
  h$regs[89] = null;
  h$regs[90] = null;
  h$regs[91] = null;
  h$regs[92] = null;
  h$regs[93] = null;
  h$regs[94] = null;
  h$regs[95] = null;
};
function h$resetResultVars()
{
  h$ret1 = null;
  h$ret2 = null;
  h$ret3 = null;
  h$ret4 = null;
  h$ret5 = null;
  h$ret6 = null;
  h$ret7 = null;
  h$ret8 = null;
  h$ret9 = null;
  h$ret10 = null;
};
function h$p1(x1)
{
  ++h$sp;
  h$stack[(h$sp - 0)] = x1;
};
function h$p2(x1, x2)
{
  h$sp += 2;
  h$stack[(h$sp - 1)] = x1;
  h$stack[(h$sp - 0)] = x2;
};
function h$p3(x1, x2, x3)
{
  h$sp += 3;
  h$stack[(h$sp - 2)] = x1;
  h$stack[(h$sp - 1)] = x2;
  h$stack[(h$sp - 0)] = x3;
};
function h$p4(x1, x2, x3, x4)
{
  h$sp += 4;
  h$stack[(h$sp - 3)] = x1;
  h$stack[(h$sp - 2)] = x2;
  h$stack[(h$sp - 1)] = x3;
  h$stack[(h$sp - 0)] = x4;
};
function h$p5(x1, x2, x3, x4, x5)
{
  h$sp += 5;
  h$stack[(h$sp - 4)] = x1;
  h$stack[(h$sp - 3)] = x2;
  h$stack[(h$sp - 2)] = x3;
  h$stack[(h$sp - 1)] = x4;
  h$stack[(h$sp - 0)] = x5;
};
function h$p6(x1, x2, x3, x4, x5, x6)
{
  h$sp += 6;
  h$stack[(h$sp - 5)] = x1;
  h$stack[(h$sp - 4)] = x2;
  h$stack[(h$sp - 3)] = x3;
  h$stack[(h$sp - 2)] = x4;
  h$stack[(h$sp - 1)] = x5;
  h$stack[(h$sp - 0)] = x6;
};
function h$p7(x1, x2, x3, x4, x5, x6, x7)
{
  h$sp += 7;
  h$stack[(h$sp - 6)] = x1;
  h$stack[(h$sp - 5)] = x2;
  h$stack[(h$sp - 4)] = x3;
  h$stack[(h$sp - 3)] = x4;
  h$stack[(h$sp - 2)] = x5;
  h$stack[(h$sp - 1)] = x6;
  h$stack[(h$sp - 0)] = x7;
};
function h$p8(x1, x2, x3, x4, x5, x6, x7, x8)
{
  h$sp += 8;
  h$stack[(h$sp - 7)] = x1;
  h$stack[(h$sp - 6)] = x2;
  h$stack[(h$sp - 5)] = x3;
  h$stack[(h$sp - 4)] = x4;
  h$stack[(h$sp - 3)] = x5;
  h$stack[(h$sp - 2)] = x6;
  h$stack[(h$sp - 1)] = x7;
  h$stack[(h$sp - 0)] = x8;
};
function h$p9(x1, x2, x3, x4, x5, x6, x7, x8, x9)
{
  h$sp += 9;
  h$stack[(h$sp - 8)] = x1;
  h$stack[(h$sp - 7)] = x2;
  h$stack[(h$sp - 6)] = x3;
  h$stack[(h$sp - 5)] = x4;
  h$stack[(h$sp - 4)] = x5;
  h$stack[(h$sp - 3)] = x6;
  h$stack[(h$sp - 2)] = x7;
  h$stack[(h$sp - 1)] = x8;
  h$stack[(h$sp - 0)] = x9;
};
function h$p10(x1, x2, x3, x4, x5, x6, x7, x8, x9, x10)
{
  h$sp += 10;
  h$stack[(h$sp - 9)] = x1;
  h$stack[(h$sp - 8)] = x2;
  h$stack[(h$sp - 7)] = x3;
  h$stack[(h$sp - 6)] = x4;
  h$stack[(h$sp - 5)] = x5;
  h$stack[(h$sp - 4)] = x6;
  h$stack[(h$sp - 3)] = x7;
  h$stack[(h$sp - 2)] = x8;
  h$stack[(h$sp - 1)] = x9;
  h$stack[(h$sp - 0)] = x10;
};
function h$p11(x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11)
{
  h$sp += 11;
  h$stack[(h$sp - 10)] = x1;
  h$stack[(h$sp - 9)] = x2;
  h$stack[(h$sp - 8)] = x3;
  h$stack[(h$sp - 7)] = x4;
  h$stack[(h$sp - 6)] = x5;
  h$stack[(h$sp - 5)] = x6;
  h$stack[(h$sp - 4)] = x7;
  h$stack[(h$sp - 3)] = x8;
  h$stack[(h$sp - 2)] = x9;
  h$stack[(h$sp - 1)] = x10;
  h$stack[(h$sp - 0)] = x11;
};
function h$p12(x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12)
{
  h$sp += 12;
  h$stack[(h$sp - 11)] = x1;
  h$stack[(h$sp - 10)] = x2;
  h$stack[(h$sp - 9)] = x3;
  h$stack[(h$sp - 8)] = x4;
  h$stack[(h$sp - 7)] = x5;
  h$stack[(h$sp - 6)] = x6;
  h$stack[(h$sp - 5)] = x7;
  h$stack[(h$sp - 4)] = x8;
  h$stack[(h$sp - 3)] = x9;
  h$stack[(h$sp - 2)] = x10;
  h$stack[(h$sp - 1)] = x11;
  h$stack[(h$sp - 0)] = x12;
};
function h$p13(x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13)
{
  h$sp += 13;
  h$stack[(h$sp - 12)] = x1;
  h$stack[(h$sp - 11)] = x2;
  h$stack[(h$sp - 10)] = x3;
  h$stack[(h$sp - 9)] = x4;
  h$stack[(h$sp - 8)] = x5;
  h$stack[(h$sp - 7)] = x6;
  h$stack[(h$sp - 6)] = x7;
  h$stack[(h$sp - 5)] = x8;
  h$stack[(h$sp - 4)] = x9;
  h$stack[(h$sp - 3)] = x10;
  h$stack[(h$sp - 2)] = x11;
  h$stack[(h$sp - 1)] = x12;
  h$stack[(h$sp - 0)] = x13;
};
function h$p14(x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14)
{
  h$sp += 14;
  h$stack[(h$sp - 13)] = x1;
  h$stack[(h$sp - 12)] = x2;
  h$stack[(h$sp - 11)] = x3;
  h$stack[(h$sp - 10)] = x4;
  h$stack[(h$sp - 9)] = x5;
  h$stack[(h$sp - 8)] = x6;
  h$stack[(h$sp - 7)] = x7;
  h$stack[(h$sp - 6)] = x8;
  h$stack[(h$sp - 5)] = x9;
  h$stack[(h$sp - 4)] = x10;
  h$stack[(h$sp - 3)] = x11;
  h$stack[(h$sp - 2)] = x12;
  h$stack[(h$sp - 1)] = x13;
  h$stack[(h$sp - 0)] = x14;
};
function h$p15(x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15)
{
  h$sp += 15;
  h$stack[(h$sp - 14)] = x1;
  h$stack[(h$sp - 13)] = x2;
  h$stack[(h$sp - 12)] = x3;
  h$stack[(h$sp - 11)] = x4;
  h$stack[(h$sp - 10)] = x5;
  h$stack[(h$sp - 9)] = x6;
  h$stack[(h$sp - 8)] = x7;
  h$stack[(h$sp - 7)] = x8;
  h$stack[(h$sp - 6)] = x9;
  h$stack[(h$sp - 5)] = x10;
  h$stack[(h$sp - 4)] = x11;
  h$stack[(h$sp - 3)] = x12;
  h$stack[(h$sp - 2)] = x13;
  h$stack[(h$sp - 1)] = x14;
  h$stack[(h$sp - 0)] = x15;
};
function h$p16(x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15, x16)
{
  h$sp += 16;
  h$stack[(h$sp - 15)] = x1;
  h$stack[(h$sp - 14)] = x2;
  h$stack[(h$sp - 13)] = x3;
  h$stack[(h$sp - 12)] = x4;
  h$stack[(h$sp - 11)] = x5;
  h$stack[(h$sp - 10)] = x6;
  h$stack[(h$sp - 9)] = x7;
  h$stack[(h$sp - 8)] = x8;
  h$stack[(h$sp - 7)] = x9;
  h$stack[(h$sp - 6)] = x10;
  h$stack[(h$sp - 5)] = x11;
  h$stack[(h$sp - 4)] = x12;
  h$stack[(h$sp - 3)] = x13;
  h$stack[(h$sp - 2)] = x14;
  h$stack[(h$sp - 1)] = x15;
  h$stack[(h$sp - 0)] = x16;
};
function h$p17(x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15, x16, x17)
{
  h$sp += 17;
  h$stack[(h$sp - 16)] = x1;
  h$stack[(h$sp - 15)] = x2;
  h$stack[(h$sp - 14)] = x3;
  h$stack[(h$sp - 13)] = x4;
  h$stack[(h$sp - 12)] = x5;
  h$stack[(h$sp - 11)] = x6;
  h$stack[(h$sp - 10)] = x7;
  h$stack[(h$sp - 9)] = x8;
  h$stack[(h$sp - 8)] = x9;
  h$stack[(h$sp - 7)] = x10;
  h$stack[(h$sp - 6)] = x11;
  h$stack[(h$sp - 5)] = x12;
  h$stack[(h$sp - 4)] = x13;
  h$stack[(h$sp - 3)] = x14;
  h$stack[(h$sp - 2)] = x15;
  h$stack[(h$sp - 1)] = x16;
  h$stack[(h$sp - 0)] = x17;
};
function h$p18(x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15, x16, x17, x18)
{
  h$sp += 18;
  h$stack[(h$sp - 17)] = x1;
  h$stack[(h$sp - 16)] = x2;
  h$stack[(h$sp - 15)] = x3;
  h$stack[(h$sp - 14)] = x4;
  h$stack[(h$sp - 13)] = x5;
  h$stack[(h$sp - 12)] = x6;
  h$stack[(h$sp - 11)] = x7;
  h$stack[(h$sp - 10)] = x8;
  h$stack[(h$sp - 9)] = x9;
  h$stack[(h$sp - 8)] = x10;
  h$stack[(h$sp - 7)] = x11;
  h$stack[(h$sp - 6)] = x12;
  h$stack[(h$sp - 5)] = x13;
  h$stack[(h$sp - 4)] = x14;
  h$stack[(h$sp - 3)] = x15;
  h$stack[(h$sp - 2)] = x16;
  h$stack[(h$sp - 1)] = x17;
  h$stack[(h$sp - 0)] = x18;
};
function h$p19(x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15, x16, x17, x18, x19)
{
  h$sp += 19;
  h$stack[(h$sp - 18)] = x1;
  h$stack[(h$sp - 17)] = x2;
  h$stack[(h$sp - 16)] = x3;
  h$stack[(h$sp - 15)] = x4;
  h$stack[(h$sp - 14)] = x5;
  h$stack[(h$sp - 13)] = x6;
  h$stack[(h$sp - 12)] = x7;
  h$stack[(h$sp - 11)] = x8;
  h$stack[(h$sp - 10)] = x9;
  h$stack[(h$sp - 9)] = x10;
  h$stack[(h$sp - 8)] = x11;
  h$stack[(h$sp - 7)] = x12;
  h$stack[(h$sp - 6)] = x13;
  h$stack[(h$sp - 5)] = x14;
  h$stack[(h$sp - 4)] = x15;
  h$stack[(h$sp - 3)] = x16;
  h$stack[(h$sp - 2)] = x17;
  h$stack[(h$sp - 1)] = x18;
  h$stack[(h$sp - 0)] = x19;
};
function h$p20(x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15, x16, x17, x18, x19, x20)
{
  h$sp += 20;
  h$stack[(h$sp - 19)] = x1;
  h$stack[(h$sp - 18)] = x2;
  h$stack[(h$sp - 17)] = x3;
  h$stack[(h$sp - 16)] = x4;
  h$stack[(h$sp - 15)] = x5;
  h$stack[(h$sp - 14)] = x6;
  h$stack[(h$sp - 13)] = x7;
  h$stack[(h$sp - 12)] = x8;
  h$stack[(h$sp - 11)] = x9;
  h$stack[(h$sp - 10)] = x10;
  h$stack[(h$sp - 9)] = x11;
  h$stack[(h$sp - 8)] = x12;
  h$stack[(h$sp - 7)] = x13;
  h$stack[(h$sp - 6)] = x14;
  h$stack[(h$sp - 5)] = x15;
  h$stack[(h$sp - 4)] = x16;
  h$stack[(h$sp - 3)] = x17;
  h$stack[(h$sp - 2)] = x18;
  h$stack[(h$sp - 1)] = x19;
  h$stack[(h$sp - 0)] = x20;
};
function h$p21(x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15, x16, x17, x18, x19, x20, x21)
{
  h$sp += 21;
  h$stack[(h$sp - 20)] = x1;
  h$stack[(h$sp - 19)] = x2;
  h$stack[(h$sp - 18)] = x3;
  h$stack[(h$sp - 17)] = x4;
  h$stack[(h$sp - 16)] = x5;
  h$stack[(h$sp - 15)] = x6;
  h$stack[(h$sp - 14)] = x7;
  h$stack[(h$sp - 13)] = x8;
  h$stack[(h$sp - 12)] = x9;
  h$stack[(h$sp - 11)] = x10;
  h$stack[(h$sp - 10)] = x11;
  h$stack[(h$sp - 9)] = x12;
  h$stack[(h$sp - 8)] = x13;
  h$stack[(h$sp - 7)] = x14;
  h$stack[(h$sp - 6)] = x15;
  h$stack[(h$sp - 5)] = x16;
  h$stack[(h$sp - 4)] = x17;
  h$stack[(h$sp - 3)] = x18;
  h$stack[(h$sp - 2)] = x19;
  h$stack[(h$sp - 1)] = x20;
  h$stack[(h$sp - 0)] = x21;
};
function h$p22(x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15, x16, x17, x18, x19, x20, x21, x22)
{
  h$sp += 22;
  h$stack[(h$sp - 21)] = x1;
  h$stack[(h$sp - 20)] = x2;
  h$stack[(h$sp - 19)] = x3;
  h$stack[(h$sp - 18)] = x4;
  h$stack[(h$sp - 17)] = x5;
  h$stack[(h$sp - 16)] = x6;
  h$stack[(h$sp - 15)] = x7;
  h$stack[(h$sp - 14)] = x8;
  h$stack[(h$sp - 13)] = x9;
  h$stack[(h$sp - 12)] = x10;
  h$stack[(h$sp - 11)] = x11;
  h$stack[(h$sp - 10)] = x12;
  h$stack[(h$sp - 9)] = x13;
  h$stack[(h$sp - 8)] = x14;
  h$stack[(h$sp - 7)] = x15;
  h$stack[(h$sp - 6)] = x16;
  h$stack[(h$sp - 5)] = x17;
  h$stack[(h$sp - 4)] = x18;
  h$stack[(h$sp - 3)] = x19;
  h$stack[(h$sp - 2)] = x20;
  h$stack[(h$sp - 1)] = x21;
  h$stack[(h$sp - 0)] = x22;
};
function h$p23(x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15, x16, x17, x18, x19, x20, x21, x22, x23)
{
  h$sp += 23;
  h$stack[(h$sp - 22)] = x1;
  h$stack[(h$sp - 21)] = x2;
  h$stack[(h$sp - 20)] = x3;
  h$stack[(h$sp - 19)] = x4;
  h$stack[(h$sp - 18)] = x5;
  h$stack[(h$sp - 17)] = x6;
  h$stack[(h$sp - 16)] = x7;
  h$stack[(h$sp - 15)] = x8;
  h$stack[(h$sp - 14)] = x9;
  h$stack[(h$sp - 13)] = x10;
  h$stack[(h$sp - 12)] = x11;
  h$stack[(h$sp - 11)] = x12;
  h$stack[(h$sp - 10)] = x13;
  h$stack[(h$sp - 9)] = x14;
  h$stack[(h$sp - 8)] = x15;
  h$stack[(h$sp - 7)] = x16;
  h$stack[(h$sp - 6)] = x17;
  h$stack[(h$sp - 5)] = x18;
  h$stack[(h$sp - 4)] = x19;
  h$stack[(h$sp - 3)] = x20;
  h$stack[(h$sp - 2)] = x21;
  h$stack[(h$sp - 1)] = x22;
  h$stack[(h$sp - 0)] = x23;
};
function h$p24(x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15, x16, x17, x18, x19, x20, x21, x22, x23,
x24)
{
  h$sp += 24;
  h$stack[(h$sp - 23)] = x1;
  h$stack[(h$sp - 22)] = x2;
  h$stack[(h$sp - 21)] = x3;
  h$stack[(h$sp - 20)] = x4;
  h$stack[(h$sp - 19)] = x5;
  h$stack[(h$sp - 18)] = x6;
  h$stack[(h$sp - 17)] = x7;
  h$stack[(h$sp - 16)] = x8;
  h$stack[(h$sp - 15)] = x9;
  h$stack[(h$sp - 14)] = x10;
  h$stack[(h$sp - 13)] = x11;
  h$stack[(h$sp - 12)] = x12;
  h$stack[(h$sp - 11)] = x13;
  h$stack[(h$sp - 10)] = x14;
  h$stack[(h$sp - 9)] = x15;
  h$stack[(h$sp - 8)] = x16;
  h$stack[(h$sp - 7)] = x17;
  h$stack[(h$sp - 6)] = x18;
  h$stack[(h$sp - 5)] = x19;
  h$stack[(h$sp - 4)] = x20;
  h$stack[(h$sp - 3)] = x21;
  h$stack[(h$sp - 2)] = x22;
  h$stack[(h$sp - 1)] = x23;
  h$stack[(h$sp - 0)] = x24;
};
function h$p25(x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15, x16, x17, x18, x19, x20, x21, x22, x23,
x24, x25)
{
  h$sp += 25;
  h$stack[(h$sp - 24)] = x1;
  h$stack[(h$sp - 23)] = x2;
  h$stack[(h$sp - 22)] = x3;
  h$stack[(h$sp - 21)] = x4;
  h$stack[(h$sp - 20)] = x5;
  h$stack[(h$sp - 19)] = x6;
  h$stack[(h$sp - 18)] = x7;
  h$stack[(h$sp - 17)] = x8;
  h$stack[(h$sp - 16)] = x9;
  h$stack[(h$sp - 15)] = x10;
  h$stack[(h$sp - 14)] = x11;
  h$stack[(h$sp - 13)] = x12;
  h$stack[(h$sp - 12)] = x13;
  h$stack[(h$sp - 11)] = x14;
  h$stack[(h$sp - 10)] = x15;
  h$stack[(h$sp - 9)] = x16;
  h$stack[(h$sp - 8)] = x17;
  h$stack[(h$sp - 7)] = x18;
  h$stack[(h$sp - 6)] = x19;
  h$stack[(h$sp - 5)] = x20;
  h$stack[(h$sp - 4)] = x21;
  h$stack[(h$sp - 3)] = x22;
  h$stack[(h$sp - 2)] = x23;
  h$stack[(h$sp - 1)] = x24;
  h$stack[(h$sp - 0)] = x25;
};
function h$p26(x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15, x16, x17, x18, x19, x20, x21, x22, x23,
x24, x25, x26)
{
  h$sp += 26;
  h$stack[(h$sp - 25)] = x1;
  h$stack[(h$sp - 24)] = x2;
  h$stack[(h$sp - 23)] = x3;
  h$stack[(h$sp - 22)] = x4;
  h$stack[(h$sp - 21)] = x5;
  h$stack[(h$sp - 20)] = x6;
  h$stack[(h$sp - 19)] = x7;
  h$stack[(h$sp - 18)] = x8;
  h$stack[(h$sp - 17)] = x9;
  h$stack[(h$sp - 16)] = x10;
  h$stack[(h$sp - 15)] = x11;
  h$stack[(h$sp - 14)] = x12;
  h$stack[(h$sp - 13)] = x13;
  h$stack[(h$sp - 12)] = x14;
  h$stack[(h$sp - 11)] = x15;
  h$stack[(h$sp - 10)] = x16;
  h$stack[(h$sp - 9)] = x17;
  h$stack[(h$sp - 8)] = x18;
  h$stack[(h$sp - 7)] = x19;
  h$stack[(h$sp - 6)] = x20;
  h$stack[(h$sp - 5)] = x21;
  h$stack[(h$sp - 4)] = x22;
  h$stack[(h$sp - 3)] = x23;
  h$stack[(h$sp - 2)] = x24;
  h$stack[(h$sp - 1)] = x25;
  h$stack[(h$sp - 0)] = x26;
};
function h$p27(x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15, x16, x17, x18, x19, x20, x21, x22, x23,
x24, x25, x26, x27)
{
  h$sp += 27;
  h$stack[(h$sp - 26)] = x1;
  h$stack[(h$sp - 25)] = x2;
  h$stack[(h$sp - 24)] = x3;
  h$stack[(h$sp - 23)] = x4;
  h$stack[(h$sp - 22)] = x5;
  h$stack[(h$sp - 21)] = x6;
  h$stack[(h$sp - 20)] = x7;
  h$stack[(h$sp - 19)] = x8;
  h$stack[(h$sp - 18)] = x9;
  h$stack[(h$sp - 17)] = x10;
  h$stack[(h$sp - 16)] = x11;
  h$stack[(h$sp - 15)] = x12;
  h$stack[(h$sp - 14)] = x13;
  h$stack[(h$sp - 13)] = x14;
  h$stack[(h$sp - 12)] = x15;
  h$stack[(h$sp - 11)] = x16;
  h$stack[(h$sp - 10)] = x17;
  h$stack[(h$sp - 9)] = x18;
  h$stack[(h$sp - 8)] = x19;
  h$stack[(h$sp - 7)] = x20;
  h$stack[(h$sp - 6)] = x21;
  h$stack[(h$sp - 5)] = x22;
  h$stack[(h$sp - 4)] = x23;
  h$stack[(h$sp - 3)] = x24;
  h$stack[(h$sp - 2)] = x25;
  h$stack[(h$sp - 1)] = x26;
  h$stack[(h$sp - 0)] = x27;
};
function h$p28(x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15, x16, x17, x18, x19, x20, x21, x22, x23,
x24, x25, x26, x27, x28)
{
  h$sp += 28;
  h$stack[(h$sp - 27)] = x1;
  h$stack[(h$sp - 26)] = x2;
  h$stack[(h$sp - 25)] = x3;
  h$stack[(h$sp - 24)] = x4;
  h$stack[(h$sp - 23)] = x5;
  h$stack[(h$sp - 22)] = x6;
  h$stack[(h$sp - 21)] = x7;
  h$stack[(h$sp - 20)] = x8;
  h$stack[(h$sp - 19)] = x9;
  h$stack[(h$sp - 18)] = x10;
  h$stack[(h$sp - 17)] = x11;
  h$stack[(h$sp - 16)] = x12;
  h$stack[(h$sp - 15)] = x13;
  h$stack[(h$sp - 14)] = x14;
  h$stack[(h$sp - 13)] = x15;
  h$stack[(h$sp - 12)] = x16;
  h$stack[(h$sp - 11)] = x17;
  h$stack[(h$sp - 10)] = x18;
  h$stack[(h$sp - 9)] = x19;
  h$stack[(h$sp - 8)] = x20;
  h$stack[(h$sp - 7)] = x21;
  h$stack[(h$sp - 6)] = x22;
  h$stack[(h$sp - 5)] = x23;
  h$stack[(h$sp - 4)] = x24;
  h$stack[(h$sp - 3)] = x25;
  h$stack[(h$sp - 2)] = x26;
  h$stack[(h$sp - 1)] = x27;
  h$stack[(h$sp - 0)] = x28;
};
function h$p29(x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15, x16, x17, x18, x19, x20, x21, x22, x23,
x24, x25, x26, x27, x28, x29)
{
  h$sp += 29;
  h$stack[(h$sp - 28)] = x1;
  h$stack[(h$sp - 27)] = x2;
  h$stack[(h$sp - 26)] = x3;
  h$stack[(h$sp - 25)] = x4;
  h$stack[(h$sp - 24)] = x5;
  h$stack[(h$sp - 23)] = x6;
  h$stack[(h$sp - 22)] = x7;
  h$stack[(h$sp - 21)] = x8;
  h$stack[(h$sp - 20)] = x9;
  h$stack[(h$sp - 19)] = x10;
  h$stack[(h$sp - 18)] = x11;
  h$stack[(h$sp - 17)] = x12;
  h$stack[(h$sp - 16)] = x13;
  h$stack[(h$sp - 15)] = x14;
  h$stack[(h$sp - 14)] = x15;
  h$stack[(h$sp - 13)] = x16;
  h$stack[(h$sp - 12)] = x17;
  h$stack[(h$sp - 11)] = x18;
  h$stack[(h$sp - 10)] = x19;
  h$stack[(h$sp - 9)] = x20;
  h$stack[(h$sp - 8)] = x21;
  h$stack[(h$sp - 7)] = x22;
  h$stack[(h$sp - 6)] = x23;
  h$stack[(h$sp - 5)] = x24;
  h$stack[(h$sp - 4)] = x25;
  h$stack[(h$sp - 3)] = x26;
  h$stack[(h$sp - 2)] = x27;
  h$stack[(h$sp - 1)] = x28;
  h$stack[(h$sp - 0)] = x29;
};
function h$p30(x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15, x16, x17, x18, x19, x20, x21, x22, x23,
x24, x25, x26, x27, x28, x29, x30)
{
  h$sp += 30;
  h$stack[(h$sp - 29)] = x1;
  h$stack[(h$sp - 28)] = x2;
  h$stack[(h$sp - 27)] = x3;
  h$stack[(h$sp - 26)] = x4;
  h$stack[(h$sp - 25)] = x5;
  h$stack[(h$sp - 24)] = x6;
  h$stack[(h$sp - 23)] = x7;
  h$stack[(h$sp - 22)] = x8;
  h$stack[(h$sp - 21)] = x9;
  h$stack[(h$sp - 20)] = x10;
  h$stack[(h$sp - 19)] = x11;
  h$stack[(h$sp - 18)] = x12;
  h$stack[(h$sp - 17)] = x13;
  h$stack[(h$sp - 16)] = x14;
  h$stack[(h$sp - 15)] = x15;
  h$stack[(h$sp - 14)] = x16;
  h$stack[(h$sp - 13)] = x17;
  h$stack[(h$sp - 12)] = x18;
  h$stack[(h$sp - 11)] = x19;
  h$stack[(h$sp - 10)] = x20;
  h$stack[(h$sp - 9)] = x21;
  h$stack[(h$sp - 8)] = x22;
  h$stack[(h$sp - 7)] = x23;
  h$stack[(h$sp - 6)] = x24;
  h$stack[(h$sp - 5)] = x25;
  h$stack[(h$sp - 4)] = x26;
  h$stack[(h$sp - 3)] = x27;
  h$stack[(h$sp - 2)] = x28;
  h$stack[(h$sp - 1)] = x29;
  h$stack[(h$sp - 0)] = x30;
};
function h$p31(x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15, x16, x17, x18, x19, x20, x21, x22, x23,
x24, x25, x26, x27, x28, x29, x30, x31)
{
  h$sp += 31;
  h$stack[(h$sp - 30)] = x1;
  h$stack[(h$sp - 29)] = x2;
  h$stack[(h$sp - 28)] = x3;
  h$stack[(h$sp - 27)] = x4;
  h$stack[(h$sp - 26)] = x5;
  h$stack[(h$sp - 25)] = x6;
  h$stack[(h$sp - 24)] = x7;
  h$stack[(h$sp - 23)] = x8;
  h$stack[(h$sp - 22)] = x9;
  h$stack[(h$sp - 21)] = x10;
  h$stack[(h$sp - 20)] = x11;
  h$stack[(h$sp - 19)] = x12;
  h$stack[(h$sp - 18)] = x13;
  h$stack[(h$sp - 17)] = x14;
  h$stack[(h$sp - 16)] = x15;
  h$stack[(h$sp - 15)] = x16;
  h$stack[(h$sp - 14)] = x17;
  h$stack[(h$sp - 13)] = x18;
  h$stack[(h$sp - 12)] = x19;
  h$stack[(h$sp - 11)] = x20;
  h$stack[(h$sp - 10)] = x21;
  h$stack[(h$sp - 9)] = x22;
  h$stack[(h$sp - 8)] = x23;
  h$stack[(h$sp - 7)] = x24;
  h$stack[(h$sp - 6)] = x25;
  h$stack[(h$sp - 5)] = x26;
  h$stack[(h$sp - 4)] = x27;
  h$stack[(h$sp - 3)] = x28;
  h$stack[(h$sp - 2)] = x29;
  h$stack[(h$sp - 1)] = x30;
  h$stack[(h$sp - 0)] = x31;
};
function h$p32(x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15, x16, x17, x18, x19, x20, x21, x22, x23,
x24, x25, x26, x27, x28, x29, x30, x31, x32)
{
  h$sp += 32;
  h$stack[(h$sp - 31)] = x1;
  h$stack[(h$sp - 30)] = x2;
  h$stack[(h$sp - 29)] = x3;
  h$stack[(h$sp - 28)] = x4;
  h$stack[(h$sp - 27)] = x5;
  h$stack[(h$sp - 26)] = x6;
  h$stack[(h$sp - 25)] = x7;
  h$stack[(h$sp - 24)] = x8;
  h$stack[(h$sp - 23)] = x9;
  h$stack[(h$sp - 22)] = x10;
  h$stack[(h$sp - 21)] = x11;
  h$stack[(h$sp - 20)] = x12;
  h$stack[(h$sp - 19)] = x13;
  h$stack[(h$sp - 18)] = x14;
  h$stack[(h$sp - 17)] = x15;
  h$stack[(h$sp - 16)] = x16;
  h$stack[(h$sp - 15)] = x17;
  h$stack[(h$sp - 14)] = x18;
  h$stack[(h$sp - 13)] = x19;
  h$stack[(h$sp - 12)] = x20;
  h$stack[(h$sp - 11)] = x21;
  h$stack[(h$sp - 10)] = x22;
  h$stack[(h$sp - 9)] = x23;
  h$stack[(h$sp - 8)] = x24;
  h$stack[(h$sp - 7)] = x25;
  h$stack[(h$sp - 6)] = x26;
  h$stack[(h$sp - 5)] = x27;
  h$stack[(h$sp - 4)] = x28;
  h$stack[(h$sp - 3)] = x29;
  h$stack[(h$sp - 2)] = x30;
  h$stack[(h$sp - 1)] = x31;
  h$stack[(h$sp - 0)] = x32;
};
function h$pp2(x1)
{
  h$sp += 2;
  h$stack[(h$sp - 0)] = x1;
};
function h$pp4(x1)
{
  h$sp += 3;
  h$stack[(h$sp - 0)] = x1;
};
function h$pp5(x1, x2)
{
  h$sp += 3;
  h$stack[(h$sp - 2)] = x1;
  h$stack[(h$sp - 0)] = x2;
};
function h$pp6(x1, x2)
{
  h$sp += 3;
  h$stack[(h$sp - 1)] = x1;
  h$stack[(h$sp - 0)] = x2;
};
function h$pp8(x1)
{
  h$sp += 4;
  h$stack[(h$sp - 0)] = x1;
};
function h$pp9(x1, x2)
{
  h$sp += 4;
  h$stack[(h$sp - 3)] = x1;
  h$stack[(h$sp - 0)] = x2;
};
function h$pp10(x1, x2)
{
  h$sp += 4;
  h$stack[(h$sp - 2)] = x1;
  h$stack[(h$sp - 0)] = x2;
};
function h$pp11(x1, x2, x3)
{
  h$sp += 4;
  h$stack[(h$sp - 3)] = x1;
  h$stack[(h$sp - 2)] = x2;
  h$stack[(h$sp - 0)] = x3;
};
function h$pp12(x1, x2)
{
  h$sp += 4;
  h$stack[(h$sp - 1)] = x1;
  h$stack[(h$sp - 0)] = x2;
};
function h$pp13(x1, x2, x3)
{
  h$sp += 4;
  h$stack[(h$sp - 3)] = x1;
  h$stack[(h$sp - 1)] = x2;
  h$stack[(h$sp - 0)] = x3;
};
function h$pp14(x1, x2, x3)
{
  h$sp += 4;
  h$stack[(h$sp - 2)] = x1;
  h$stack[(h$sp - 1)] = x2;
  h$stack[(h$sp - 0)] = x3;
};
function h$pp16(x1)
{
  h$sp += 5;
  h$stack[(h$sp - 0)] = x1;
};
function h$pp17(x1, x2)
{
  h$sp += 5;
  h$stack[(h$sp - 4)] = x1;
  h$stack[(h$sp - 0)] = x2;
};
function h$pp18(x1, x2)
{
  h$sp += 5;
  h$stack[(h$sp - 3)] = x1;
  h$stack[(h$sp - 0)] = x2;
};
function h$pp19(x1, x2, x3)
{
  h$sp += 5;
  h$stack[(h$sp - 4)] = x1;
  h$stack[(h$sp - 3)] = x2;
  h$stack[(h$sp - 0)] = x3;
};
function h$pp20(x1, x2)
{
  h$sp += 5;
  h$stack[(h$sp - 2)] = x1;
  h$stack[(h$sp - 0)] = x2;
};
function h$pp21(x1, x2, x3)
{
  h$sp += 5;
  h$stack[(h$sp - 4)] = x1;
  h$stack[(h$sp - 2)] = x2;
  h$stack[(h$sp - 0)] = x3;
};
function h$pp22(x1, x2, x3)
{
  h$sp += 5;
  h$stack[(h$sp - 3)] = x1;
  h$stack[(h$sp - 2)] = x2;
  h$stack[(h$sp - 0)] = x3;
};
function h$pp23(x1, x2, x3, x4)
{
  h$sp += 5;
  h$stack[(h$sp - 4)] = x1;
  h$stack[(h$sp - 3)] = x2;
  h$stack[(h$sp - 2)] = x3;
  h$stack[(h$sp - 0)] = x4;
};
function h$pp24(x1, x2)
{
  h$sp += 5;
  h$stack[(h$sp - 1)] = x1;
  h$stack[(h$sp - 0)] = x2;
};
function h$pp25(x1, x2, x3)
{
  h$sp += 5;
  h$stack[(h$sp - 4)] = x1;
  h$stack[(h$sp - 1)] = x2;
  h$stack[(h$sp - 0)] = x3;
};
function h$pp26(x1, x2, x3)
{
  h$sp += 5;
  h$stack[(h$sp - 3)] = x1;
  h$stack[(h$sp - 1)] = x2;
  h$stack[(h$sp - 0)] = x3;
};
function h$pp27(x1, x2, x3, x4)
{
  h$sp += 5;
  h$stack[(h$sp - 4)] = x1;
  h$stack[(h$sp - 3)] = x2;
  h$stack[(h$sp - 1)] = x3;
  h$stack[(h$sp - 0)] = x4;
};
function h$pp28(x1, x2, x3)
{
  h$sp += 5;
  h$stack[(h$sp - 2)] = x1;
  h$stack[(h$sp - 1)] = x2;
  h$stack[(h$sp - 0)] = x3;
};
function h$pp29(x1, x2, x3, x4)
{
  h$sp += 5;
  h$stack[(h$sp - 4)] = x1;
  h$stack[(h$sp - 2)] = x2;
  h$stack[(h$sp - 1)] = x3;
  h$stack[(h$sp - 0)] = x4;
};
function h$pp30(x1, x2, x3, x4)
{
  h$sp += 5;
  h$stack[(h$sp - 3)] = x1;
  h$stack[(h$sp - 2)] = x2;
  h$stack[(h$sp - 1)] = x3;
  h$stack[(h$sp - 0)] = x4;
};
function h$pp32(x1)
{
  h$sp += 6;
  h$stack[(h$sp - 0)] = x1;
};
function h$pp33(x1, x2)
{
  h$sp += 6;
  h$stack[(h$sp - 5)] = x1;
  h$stack[(h$sp - 0)] = x2;
};
function h$pp34(x1, x2)
{
  h$sp += 6;
  h$stack[(h$sp - 4)] = x1;
  h$stack[(h$sp - 0)] = x2;
};
function h$pp35(x1, x2, x3)
{
  h$sp += 6;
  h$stack[(h$sp - 5)] = x1;
  h$stack[(h$sp - 4)] = x2;
  h$stack[(h$sp - 0)] = x3;
};
function h$pp36(x1, x2)
{
  h$sp += 6;
  h$stack[(h$sp - 3)] = x1;
  h$stack[(h$sp - 0)] = x2;
};
function h$pp37(x1, x2, x3)
{
  h$sp += 6;
  h$stack[(h$sp - 5)] = x1;
  h$stack[(h$sp - 3)] = x2;
  h$stack[(h$sp - 0)] = x3;
};
function h$pp38(x1, x2, x3)
{
  h$sp += 6;
  h$stack[(h$sp - 4)] = x1;
  h$stack[(h$sp - 3)] = x2;
  h$stack[(h$sp - 0)] = x3;
};
function h$pp39(x1, x2, x3, x4)
{
  h$sp += 6;
  h$stack[(h$sp - 5)] = x1;
  h$stack[(h$sp - 4)] = x2;
  h$stack[(h$sp - 3)] = x3;
  h$stack[(h$sp - 0)] = x4;
};
function h$pp40(x1, x2)
{
  h$sp += 6;
  h$stack[(h$sp - 2)] = x1;
  h$stack[(h$sp - 0)] = x2;
};
function h$pp41(x1, x2, x3)
{
  h$sp += 6;
  h$stack[(h$sp - 5)] = x1;
  h$stack[(h$sp - 2)] = x2;
  h$stack[(h$sp - 0)] = x3;
};
function h$pp42(x1, x2, x3)
{
  h$sp += 6;
  h$stack[(h$sp - 4)] = x1;
  h$stack[(h$sp - 2)] = x2;
  h$stack[(h$sp - 0)] = x3;
};
function h$pp43(x1, x2, x3, x4)
{
  h$sp += 6;
  h$stack[(h$sp - 5)] = x1;
  h$stack[(h$sp - 4)] = x2;
  h$stack[(h$sp - 2)] = x3;
  h$stack[(h$sp - 0)] = x4;
};
function h$pp44(x1, x2, x3)
{
  h$sp += 6;
  h$stack[(h$sp - 3)] = x1;
  h$stack[(h$sp - 2)] = x2;
  h$stack[(h$sp - 0)] = x3;
};
function h$pp45(x1, x2, x3, x4)
{
  h$sp += 6;
  h$stack[(h$sp - 5)] = x1;
  h$stack[(h$sp - 3)] = x2;
  h$stack[(h$sp - 2)] = x3;
  h$stack[(h$sp - 0)] = x4;
};
function h$pp46(x1, x2, x3, x4)
{
  h$sp += 6;
  h$stack[(h$sp - 4)] = x1;
  h$stack[(h$sp - 3)] = x2;
  h$stack[(h$sp - 2)] = x3;
  h$stack[(h$sp - 0)] = x4;
};
function h$pp47(x1, x2, x3, x4, x5)
{
  h$sp += 6;
  h$stack[(h$sp - 5)] = x1;
  h$stack[(h$sp - 4)] = x2;
  h$stack[(h$sp - 3)] = x3;
  h$stack[(h$sp - 2)] = x4;
  h$stack[(h$sp - 0)] = x5;
};
function h$pp48(x1, x2)
{
  h$sp += 6;
  h$stack[(h$sp - 1)] = x1;
  h$stack[(h$sp - 0)] = x2;
};
function h$pp49(x1, x2, x3)
{
  h$sp += 6;
  h$stack[(h$sp - 5)] = x1;
  h$stack[(h$sp - 1)] = x2;
  h$stack[(h$sp - 0)] = x3;
};
function h$pp50(x1, x2, x3)
{
  h$sp += 6;
  h$stack[(h$sp - 4)] = x1;
  h$stack[(h$sp - 1)] = x2;
  h$stack[(h$sp - 0)] = x3;
};
function h$pp51(x1, x2, x3, x4)
{
  h$sp += 6;
  h$stack[(h$sp - 5)] = x1;
  h$stack[(h$sp - 4)] = x2;
  h$stack[(h$sp - 1)] = x3;
  h$stack[(h$sp - 0)] = x4;
};
function h$pp52(x1, x2, x3)
{
  h$sp += 6;
  h$stack[(h$sp - 3)] = x1;
  h$stack[(h$sp - 1)] = x2;
  h$stack[(h$sp - 0)] = x3;
};
function h$pp53(x1, x2, x3, x4)
{
  h$sp += 6;
  h$stack[(h$sp - 5)] = x1;
  h$stack[(h$sp - 3)] = x2;
  h$stack[(h$sp - 1)] = x3;
  h$stack[(h$sp - 0)] = x4;
};
function h$pp54(x1, x2, x3, x4)
{
  h$sp += 6;
  h$stack[(h$sp - 4)] = x1;
  h$stack[(h$sp - 3)] = x2;
  h$stack[(h$sp - 1)] = x3;
  h$stack[(h$sp - 0)] = x4;
};
function h$pp55(x1, x2, x3, x4, x5)
{
  h$sp += 6;
  h$stack[(h$sp - 5)] = x1;
  h$stack[(h$sp - 4)] = x2;
  h$stack[(h$sp - 3)] = x3;
  h$stack[(h$sp - 1)] = x4;
  h$stack[(h$sp - 0)] = x5;
};
function h$pp56(x1, x2, x3)
{
  h$sp += 6;
  h$stack[(h$sp - 2)] = x1;
  h$stack[(h$sp - 1)] = x2;
  h$stack[(h$sp - 0)] = x3;
};
function h$pp57(x1, x2, x3, x4)
{
  h$sp += 6;
  h$stack[(h$sp - 5)] = x1;
  h$stack[(h$sp - 2)] = x2;
  h$stack[(h$sp - 1)] = x3;
  h$stack[(h$sp - 0)] = x4;
};
function h$pp58(x1, x2, x3, x4)
{
  h$sp += 6;
  h$stack[(h$sp - 4)] = x1;
  h$stack[(h$sp - 2)] = x2;
  h$stack[(h$sp - 1)] = x3;
  h$stack[(h$sp - 0)] = x4;
};
function h$pp59(x1, x2, x3, x4, x5)
{
  h$sp += 6;
  h$stack[(h$sp - 5)] = x1;
  h$stack[(h$sp - 4)] = x2;
  h$stack[(h$sp - 2)] = x3;
  h$stack[(h$sp - 1)] = x4;
  h$stack[(h$sp - 0)] = x5;
};
function h$pp60(x1, x2, x3, x4)
{
  h$sp += 6;
  h$stack[(h$sp - 3)] = x1;
  h$stack[(h$sp - 2)] = x2;
  h$stack[(h$sp - 1)] = x3;
  h$stack[(h$sp - 0)] = x4;
};
function h$pp61(x1, x2, x3, x4, x5)
{
  h$sp += 6;
  h$stack[(h$sp - 5)] = x1;
  h$stack[(h$sp - 3)] = x2;
  h$stack[(h$sp - 2)] = x3;
  h$stack[(h$sp - 1)] = x4;
  h$stack[(h$sp - 0)] = x5;
};
function h$pp62(x1, x2, x3, x4, x5)
{
  h$sp += 6;
  h$stack[(h$sp - 4)] = x1;
  h$stack[(h$sp - 3)] = x2;
  h$stack[(h$sp - 2)] = x3;
  h$stack[(h$sp - 1)] = x4;
  h$stack[(h$sp - 0)] = x5;
};
function h$pp64(x1)
{
  h$sp += 7;
  h$stack[(h$sp - 0)] = x1;
};
function h$pp65(x1, x2)
{
  h$sp += 7;
  h$stack[(h$sp - 6)] = x1;
  h$stack[(h$sp - 0)] = x2;
};
function h$pp66(x1, x2)
{
  h$sp += 7;
  h$stack[(h$sp - 5)] = x1;
  h$stack[(h$sp - 0)] = x2;
};
function h$pp67(x1, x2, x3)
{
  h$sp += 7;
  h$stack[(h$sp - 6)] = x1;
  h$stack[(h$sp - 5)] = x2;
  h$stack[(h$sp - 0)] = x3;
};
function h$pp68(x1, x2)
{
  h$sp += 7;
  h$stack[(h$sp - 4)] = x1;
  h$stack[(h$sp - 0)] = x2;
};
function h$pp69(x1, x2, x3)
{
  h$sp += 7;
  h$stack[(h$sp - 6)] = x1;
  h$stack[(h$sp - 4)] = x2;
  h$stack[(h$sp - 0)] = x3;
};
function h$pp70(x1, x2, x3)
{
  h$sp += 7;
  h$stack[(h$sp - 5)] = x1;
  h$stack[(h$sp - 4)] = x2;
  h$stack[(h$sp - 0)] = x3;
};
function h$pp71(x1, x2, x3, x4)
{
  h$sp += 7;
  h$stack[(h$sp - 6)] = x1;
  h$stack[(h$sp - 5)] = x2;
  h$stack[(h$sp - 4)] = x3;
  h$stack[(h$sp - 0)] = x4;
};
function h$pp72(x1, x2)
{
  h$sp += 7;
  h$stack[(h$sp - 3)] = x1;
  h$stack[(h$sp - 0)] = x2;
};
function h$pp73(x1, x2, x3)
{
  h$sp += 7;
  h$stack[(h$sp - 6)] = x1;
  h$stack[(h$sp - 3)] = x2;
  h$stack[(h$sp - 0)] = x3;
};
function h$pp74(x1, x2, x3)
{
  h$sp += 7;
  h$stack[(h$sp - 5)] = x1;
  h$stack[(h$sp - 3)] = x2;
  h$stack[(h$sp - 0)] = x3;
};
function h$pp75(x1, x2, x3, x4)
{
  h$sp += 7;
  h$stack[(h$sp - 6)] = x1;
  h$stack[(h$sp - 5)] = x2;
  h$stack[(h$sp - 3)] = x3;
  h$stack[(h$sp - 0)] = x4;
};
function h$pp76(x1, x2, x3)
{
  h$sp += 7;
  h$stack[(h$sp - 4)] = x1;
  h$stack[(h$sp - 3)] = x2;
  h$stack[(h$sp - 0)] = x3;
};
function h$pp77(x1, x2, x3, x4)
{
  h$sp += 7;
  h$stack[(h$sp - 6)] = x1;
  h$stack[(h$sp - 4)] = x2;
  h$stack[(h$sp - 3)] = x3;
  h$stack[(h$sp - 0)] = x4;
};
function h$pp78(x1, x2, x3, x4)
{
  h$sp += 7;
  h$stack[(h$sp - 5)] = x1;
  h$stack[(h$sp - 4)] = x2;
  h$stack[(h$sp - 3)] = x3;
  h$stack[(h$sp - 0)] = x4;
};
function h$pp79(x1, x2, x3, x4, x5)
{
  h$sp += 7;
  h$stack[(h$sp - 6)] = x1;
  h$stack[(h$sp - 5)] = x2;
  h$stack[(h$sp - 4)] = x3;
  h$stack[(h$sp - 3)] = x4;
  h$stack[(h$sp - 0)] = x5;
};
function h$pp80(x1, x2)
{
  h$sp += 7;
  h$stack[(h$sp - 2)] = x1;
  h$stack[(h$sp - 0)] = x2;
};
function h$pp81(x1, x2, x3)
{
  h$sp += 7;
  h$stack[(h$sp - 6)] = x1;
  h$stack[(h$sp - 2)] = x2;
  h$stack[(h$sp - 0)] = x3;
};
function h$pp82(x1, x2, x3)
{
  h$sp += 7;
  h$stack[(h$sp - 5)] = x1;
  h$stack[(h$sp - 2)] = x2;
  h$stack[(h$sp - 0)] = x3;
};
function h$pp83(x1, x2, x3, x4)
{
  h$sp += 7;
  h$stack[(h$sp - 6)] = x1;
  h$stack[(h$sp - 5)] = x2;
  h$stack[(h$sp - 2)] = x3;
  h$stack[(h$sp - 0)] = x4;
};
function h$pp84(x1, x2, x3)
{
  h$sp += 7;
  h$stack[(h$sp - 4)] = x1;
  h$stack[(h$sp - 2)] = x2;
  h$stack[(h$sp - 0)] = x3;
};
function h$pp85(x1, x2, x3, x4)
{
  h$sp += 7;
  h$stack[(h$sp - 6)] = x1;
  h$stack[(h$sp - 4)] = x2;
  h$stack[(h$sp - 2)] = x3;
  h$stack[(h$sp - 0)] = x4;
};
function h$pp86(x1, x2, x3, x4)
{
  h$sp += 7;
  h$stack[(h$sp - 5)] = x1;
  h$stack[(h$sp - 4)] = x2;
  h$stack[(h$sp - 2)] = x3;
  h$stack[(h$sp - 0)] = x4;
};
function h$pp87(x1, x2, x3, x4, x5)
{
  h$sp += 7;
  h$stack[(h$sp - 6)] = x1;
  h$stack[(h$sp - 5)] = x2;
  h$stack[(h$sp - 4)] = x3;
  h$stack[(h$sp - 2)] = x4;
  h$stack[(h$sp - 0)] = x5;
};
function h$pp88(x1, x2, x3)
{
  h$sp += 7;
  h$stack[(h$sp - 3)] = x1;
  h$stack[(h$sp - 2)] = x2;
  h$stack[(h$sp - 0)] = x3;
};
function h$pp89(x1, x2, x3, x4)
{
  h$sp += 7;
  h$stack[(h$sp - 6)] = x1;
  h$stack[(h$sp - 3)] = x2;
  h$stack[(h$sp - 2)] = x3;
  h$stack[(h$sp - 0)] = x4;
};
function h$pp90(x1, x2, x3, x4)
{
  h$sp += 7;
  h$stack[(h$sp - 5)] = x1;
  h$stack[(h$sp - 3)] = x2;
  h$stack[(h$sp - 2)] = x3;
  h$stack[(h$sp - 0)] = x4;
};
function h$pp91(x1, x2, x3, x4, x5)
{
  h$sp += 7;
  h$stack[(h$sp - 6)] = x1;
  h$stack[(h$sp - 5)] = x2;
  h$stack[(h$sp - 3)] = x3;
  h$stack[(h$sp - 2)] = x4;
  h$stack[(h$sp - 0)] = x5;
};
function h$pp92(x1, x2, x3, x4)
{
  h$sp += 7;
  h$stack[(h$sp - 4)] = x1;
  h$stack[(h$sp - 3)] = x2;
  h$stack[(h$sp - 2)] = x3;
  h$stack[(h$sp - 0)] = x4;
};
function h$pp93(x1, x2, x3, x4, x5)
{
  h$sp += 7;
  h$stack[(h$sp - 6)] = x1;
  h$stack[(h$sp - 4)] = x2;
  h$stack[(h$sp - 3)] = x3;
  h$stack[(h$sp - 2)] = x4;
  h$stack[(h$sp - 0)] = x5;
};
function h$pp94(x1, x2, x3, x4, x5)
{
  h$sp += 7;
  h$stack[(h$sp - 5)] = x1;
  h$stack[(h$sp - 4)] = x2;
  h$stack[(h$sp - 3)] = x3;
  h$stack[(h$sp - 2)] = x4;
  h$stack[(h$sp - 0)] = x5;
};
function h$pp95(x1, x2, x3, x4, x5, x6)
{
  h$sp += 7;
  h$stack[(h$sp - 6)] = x1;
  h$stack[(h$sp - 5)] = x2;
  h$stack[(h$sp - 4)] = x3;
  h$stack[(h$sp - 3)] = x4;
  h$stack[(h$sp - 2)] = x5;
  h$stack[(h$sp - 0)] = x6;
};
function h$pp96(x1, x2)
{
  h$sp += 7;
  h$stack[(h$sp - 1)] = x1;
  h$stack[(h$sp - 0)] = x2;
};
function h$pp97(x1, x2, x3)
{
  h$sp += 7;
  h$stack[(h$sp - 6)] = x1;
  h$stack[(h$sp - 1)] = x2;
  h$stack[(h$sp - 0)] = x3;
};
function h$pp98(x1, x2, x3)
{
  h$sp += 7;
  h$stack[(h$sp - 5)] = x1;
  h$stack[(h$sp - 1)] = x2;
  h$stack[(h$sp - 0)] = x3;
};
function h$pp99(x1, x2, x3, x4)
{
  h$sp += 7;
  h$stack[(h$sp - 6)] = x1;
  h$stack[(h$sp - 5)] = x2;
  h$stack[(h$sp - 1)] = x3;
  h$stack[(h$sp - 0)] = x4;
};
function h$pp100(x1, x2, x3)
{
  h$sp += 7;
  h$stack[(h$sp - 4)] = x1;
  h$stack[(h$sp - 1)] = x2;
  h$stack[(h$sp - 0)] = x3;
};
function h$pp101(x1, x2, x3, x4)
{
  h$sp += 7;
  h$stack[(h$sp - 6)] = x1;
  h$stack[(h$sp - 4)] = x2;
  h$stack[(h$sp - 1)] = x3;
  h$stack[(h$sp - 0)] = x4;
};
function h$pp102(x1, x2, x3, x4)
{
  h$sp += 7;
  h$stack[(h$sp - 5)] = x1;
  h$stack[(h$sp - 4)] = x2;
  h$stack[(h$sp - 1)] = x3;
  h$stack[(h$sp - 0)] = x4;
};
function h$pp103(x1, x2, x3, x4, x5)
{
  h$sp += 7;
  h$stack[(h$sp - 6)] = x1;
  h$stack[(h$sp - 5)] = x2;
  h$stack[(h$sp - 4)] = x3;
  h$stack[(h$sp - 1)] = x4;
  h$stack[(h$sp - 0)] = x5;
};
function h$pp104(x1, x2, x3)
{
  h$sp += 7;
  h$stack[(h$sp - 3)] = x1;
  h$stack[(h$sp - 1)] = x2;
  h$stack[(h$sp - 0)] = x3;
};
function h$pp105(x1, x2, x3, x4)
{
  h$sp += 7;
  h$stack[(h$sp - 6)] = x1;
  h$stack[(h$sp - 3)] = x2;
  h$stack[(h$sp - 1)] = x3;
  h$stack[(h$sp - 0)] = x4;
};
function h$pp106(x1, x2, x3, x4)
{
  h$sp += 7;
  h$stack[(h$sp - 5)] = x1;
  h$stack[(h$sp - 3)] = x2;
  h$stack[(h$sp - 1)] = x3;
  h$stack[(h$sp - 0)] = x4;
};
function h$pp107(x1, x2, x3, x4, x5)
{
  h$sp += 7;
  h$stack[(h$sp - 6)] = x1;
  h$stack[(h$sp - 5)] = x2;
  h$stack[(h$sp - 3)] = x3;
  h$stack[(h$sp - 1)] = x4;
  h$stack[(h$sp - 0)] = x5;
};
function h$pp108(x1, x2, x3, x4)
{
  h$sp += 7;
  h$stack[(h$sp - 4)] = x1;
  h$stack[(h$sp - 3)] = x2;
  h$stack[(h$sp - 1)] = x3;
  h$stack[(h$sp - 0)] = x4;
};
function h$pp109(x1, x2, x3, x4, x5)
{
  h$sp += 7;
  h$stack[(h$sp - 6)] = x1;
  h$stack[(h$sp - 4)] = x2;
  h$stack[(h$sp - 3)] = x3;
  h$stack[(h$sp - 1)] = x4;
  h$stack[(h$sp - 0)] = x5;
};
function h$pp110(x1, x2, x3, x4, x5)
{
  h$sp += 7;
  h$stack[(h$sp - 5)] = x1;
  h$stack[(h$sp - 4)] = x2;
  h$stack[(h$sp - 3)] = x3;
  h$stack[(h$sp - 1)] = x4;
  h$stack[(h$sp - 0)] = x5;
};
function h$pp111(x1, x2, x3, x4, x5, x6)
{
  h$sp += 7;
  h$stack[(h$sp - 6)] = x1;
  h$stack[(h$sp - 5)] = x2;
  h$stack[(h$sp - 4)] = x3;
  h$stack[(h$sp - 3)] = x4;
  h$stack[(h$sp - 1)] = x5;
  h$stack[(h$sp - 0)] = x6;
};
function h$pp112(x1, x2, x3)
{
  h$sp += 7;
  h$stack[(h$sp - 2)] = x1;
  h$stack[(h$sp - 1)] = x2;
  h$stack[(h$sp - 0)] = x3;
};
function h$pp113(x1, x2, x3, x4)
{
  h$sp += 7;
  h$stack[(h$sp - 6)] = x1;
  h$stack[(h$sp - 2)] = x2;
  h$stack[(h$sp - 1)] = x3;
  h$stack[(h$sp - 0)] = x4;
};
function h$pp114(x1, x2, x3, x4)
{
  h$sp += 7;
  h$stack[(h$sp - 5)] = x1;
  h$stack[(h$sp - 2)] = x2;
  h$stack[(h$sp - 1)] = x3;
  h$stack[(h$sp - 0)] = x4;
};
function h$pp115(x1, x2, x3, x4, x5)
{
  h$sp += 7;
  h$stack[(h$sp - 6)] = x1;
  h$stack[(h$sp - 5)] = x2;
  h$stack[(h$sp - 2)] = x3;
  h$stack[(h$sp - 1)] = x4;
  h$stack[(h$sp - 0)] = x5;
};
function h$pp116(x1, x2, x3, x4)
{
  h$sp += 7;
  h$stack[(h$sp - 4)] = x1;
  h$stack[(h$sp - 2)] = x2;
  h$stack[(h$sp - 1)] = x3;
  h$stack[(h$sp - 0)] = x4;
};
function h$pp117(x1, x2, x3, x4, x5)
{
  h$sp += 7;
  h$stack[(h$sp - 6)] = x1;
  h$stack[(h$sp - 4)] = x2;
  h$stack[(h$sp - 2)] = x3;
  h$stack[(h$sp - 1)] = x4;
  h$stack[(h$sp - 0)] = x5;
};
function h$pp118(x1, x2, x3, x4, x5)
{
  h$sp += 7;
  h$stack[(h$sp - 5)] = x1;
  h$stack[(h$sp - 4)] = x2;
  h$stack[(h$sp - 2)] = x3;
  h$stack[(h$sp - 1)] = x4;
  h$stack[(h$sp - 0)] = x5;
};
function h$pp119(x1, x2, x3, x4, x5, x6)
{
  h$sp += 7;
  h$stack[(h$sp - 6)] = x1;
  h$stack[(h$sp - 5)] = x2;
  h$stack[(h$sp - 4)] = x3;
  h$stack[(h$sp - 2)] = x4;
  h$stack[(h$sp - 1)] = x5;
  h$stack[(h$sp - 0)] = x6;
};
function h$pp120(x1, x2, x3, x4)
{
  h$sp += 7;
  h$stack[(h$sp - 3)] = x1;
  h$stack[(h$sp - 2)] = x2;
  h$stack[(h$sp - 1)] = x3;
  h$stack[(h$sp - 0)] = x4;
};
function h$pp121(x1, x2, x3, x4, x5)
{
  h$sp += 7;
  h$stack[(h$sp - 6)] = x1;
  h$stack[(h$sp - 3)] = x2;
  h$stack[(h$sp - 2)] = x3;
  h$stack[(h$sp - 1)] = x4;
  h$stack[(h$sp - 0)] = x5;
};
function h$pp122(x1, x2, x3, x4, x5)
{
  h$sp += 7;
  h$stack[(h$sp - 5)] = x1;
  h$stack[(h$sp - 3)] = x2;
  h$stack[(h$sp - 2)] = x3;
  h$stack[(h$sp - 1)] = x4;
  h$stack[(h$sp - 0)] = x5;
};
function h$pp123(x1, x2, x3, x4, x5, x6)
{
  h$sp += 7;
  h$stack[(h$sp - 6)] = x1;
  h$stack[(h$sp - 5)] = x2;
  h$stack[(h$sp - 3)] = x3;
  h$stack[(h$sp - 2)] = x4;
  h$stack[(h$sp - 1)] = x5;
  h$stack[(h$sp - 0)] = x6;
};
function h$pp124(x1, x2, x3, x4, x5)
{
  h$sp += 7;
  h$stack[(h$sp - 4)] = x1;
  h$stack[(h$sp - 3)] = x2;
  h$stack[(h$sp - 2)] = x3;
  h$stack[(h$sp - 1)] = x4;
  h$stack[(h$sp - 0)] = x5;
};
function h$pp125(x1, x2, x3, x4, x5, x6)
{
  h$sp += 7;
  h$stack[(h$sp - 6)] = x1;
  h$stack[(h$sp - 4)] = x2;
  h$stack[(h$sp - 3)] = x3;
  h$stack[(h$sp - 2)] = x4;
  h$stack[(h$sp - 1)] = x5;
  h$stack[(h$sp - 0)] = x6;
};
function h$pp126(x1, x2, x3, x4, x5, x6)
{
  h$sp += 7;
  h$stack[(h$sp - 5)] = x1;
  h$stack[(h$sp - 4)] = x2;
  h$stack[(h$sp - 3)] = x3;
  h$stack[(h$sp - 2)] = x4;
  h$stack[(h$sp - 1)] = x5;
  h$stack[(h$sp - 0)] = x6;
};
function h$pp128(x1)
{
  h$sp += 8;
  h$stack[(h$sp - 0)] = x1;
};
function h$pp129(x1, x2)
{
  h$sp += 8;
  h$stack[(h$sp - 7)] = x1;
  h$stack[(h$sp - 0)] = x2;
};
function h$pp130(x1, x2)
{
  h$sp += 8;
  h$stack[(h$sp - 6)] = x1;
  h$stack[(h$sp - 0)] = x2;
};
function h$pp131(x1, x2, x3)
{
  h$sp += 8;
  h$stack[(h$sp - 7)] = x1;
  h$stack[(h$sp - 6)] = x2;
  h$stack[(h$sp - 0)] = x3;
};
function h$pp132(x1, x2)
{
  h$sp += 8;
  h$stack[(h$sp - 5)] = x1;
  h$stack[(h$sp - 0)] = x2;
};
function h$pp133(x1, x2, x3)
{
  h$sp += 8;
  h$stack[(h$sp - 7)] = x1;
  h$stack[(h$sp - 5)] = x2;
  h$stack[(h$sp - 0)] = x3;
};
function h$pp134(x1, x2, x3)
{
  h$sp += 8;
  h$stack[(h$sp - 6)] = x1;
  h$stack[(h$sp - 5)] = x2;
  h$stack[(h$sp - 0)] = x3;
};
function h$pp135(x1, x2, x3, x4)
{
  h$sp += 8;
  h$stack[(h$sp - 7)] = x1;
  h$stack[(h$sp - 6)] = x2;
  h$stack[(h$sp - 5)] = x3;
  h$stack[(h$sp - 0)] = x4;
};
function h$pp136(x1, x2)
{
  h$sp += 8;
  h$stack[(h$sp - 4)] = x1;
  h$stack[(h$sp - 0)] = x2;
};
function h$pp137(x1, x2, x3)
{
  h$sp += 8;
  h$stack[(h$sp - 7)] = x1;
  h$stack[(h$sp - 4)] = x2;
  h$stack[(h$sp - 0)] = x3;
};
function h$pp138(x1, x2, x3)
{
  h$sp += 8;
  h$stack[(h$sp - 6)] = x1;
  h$stack[(h$sp - 4)] = x2;
  h$stack[(h$sp - 0)] = x3;
};
function h$pp139(x1, x2, x3, x4)
{
  h$sp += 8;
  h$stack[(h$sp - 7)] = x1;
  h$stack[(h$sp - 6)] = x2;
  h$stack[(h$sp - 4)] = x3;
  h$stack[(h$sp - 0)] = x4;
};
function h$pp140(x1, x2, x3)
{
  h$sp += 8;
  h$stack[(h$sp - 5)] = x1;
  h$stack[(h$sp - 4)] = x2;
  h$stack[(h$sp - 0)] = x3;
};
function h$pp141(x1, x2, x3, x4)
{
  h$sp += 8;
  h$stack[(h$sp - 7)] = x1;
  h$stack[(h$sp - 5)] = x2;
  h$stack[(h$sp - 4)] = x3;
  h$stack[(h$sp - 0)] = x4;
};
function h$pp142(x1, x2, x3, x4)
{
  h$sp += 8;
  h$stack[(h$sp - 6)] = x1;
  h$stack[(h$sp - 5)] = x2;
  h$stack[(h$sp - 4)] = x3;
  h$stack[(h$sp - 0)] = x4;
};
function h$pp143(x1, x2, x3, x4, x5)
{
  h$sp += 8;
  h$stack[(h$sp - 7)] = x1;
  h$stack[(h$sp - 6)] = x2;
  h$stack[(h$sp - 5)] = x3;
  h$stack[(h$sp - 4)] = x4;
  h$stack[(h$sp - 0)] = x5;
};
function h$pp144(x1, x2)
{
  h$sp += 8;
  h$stack[(h$sp - 3)] = x1;
  h$stack[(h$sp - 0)] = x2;
};
function h$pp145(x1, x2, x3)
{
  h$sp += 8;
  h$stack[(h$sp - 7)] = x1;
  h$stack[(h$sp - 3)] = x2;
  h$stack[(h$sp - 0)] = x3;
};
function h$pp146(x1, x2, x3)
{
  h$sp += 8;
  h$stack[(h$sp - 6)] = x1;
  h$stack[(h$sp - 3)] = x2;
  h$stack[(h$sp - 0)] = x3;
};
function h$pp147(x1, x2, x3, x4)
{
  h$sp += 8;
  h$stack[(h$sp - 7)] = x1;
  h$stack[(h$sp - 6)] = x2;
  h$stack[(h$sp - 3)] = x3;
  h$stack[(h$sp - 0)] = x4;
};
function h$pp148(x1, x2, x3)
{
  h$sp += 8;
  h$stack[(h$sp - 5)] = x1;
  h$stack[(h$sp - 3)] = x2;
  h$stack[(h$sp - 0)] = x3;
};
function h$pp149(x1, x2, x3, x4)
{
  h$sp += 8;
  h$stack[(h$sp - 7)] = x1;
  h$stack[(h$sp - 5)] = x2;
  h$stack[(h$sp - 3)] = x3;
  h$stack[(h$sp - 0)] = x4;
};
function h$pp150(x1, x2, x3, x4)
{
  h$sp += 8;
  h$stack[(h$sp - 6)] = x1;
  h$stack[(h$sp - 5)] = x2;
  h$stack[(h$sp - 3)] = x3;
  h$stack[(h$sp - 0)] = x4;
};
function h$pp151(x1, x2, x3, x4, x5)
{
  h$sp += 8;
  h$stack[(h$sp - 7)] = x1;
  h$stack[(h$sp - 6)] = x2;
  h$stack[(h$sp - 5)] = x3;
  h$stack[(h$sp - 3)] = x4;
  h$stack[(h$sp - 0)] = x5;
};
function h$pp152(x1, x2, x3)
{
  h$sp += 8;
  h$stack[(h$sp - 4)] = x1;
  h$stack[(h$sp - 3)] = x2;
  h$stack[(h$sp - 0)] = x3;
};
function h$pp153(x1, x2, x3, x4)
{
  h$sp += 8;
  h$stack[(h$sp - 7)] = x1;
  h$stack[(h$sp - 4)] = x2;
  h$stack[(h$sp - 3)] = x3;
  h$stack[(h$sp - 0)] = x4;
};
function h$pp154(x1, x2, x3, x4)
{
  h$sp += 8;
  h$stack[(h$sp - 6)] = x1;
  h$stack[(h$sp - 4)] = x2;
  h$stack[(h$sp - 3)] = x3;
  h$stack[(h$sp - 0)] = x4;
};
function h$pp155(x1, x2, x3, x4, x5)
{
  h$sp += 8;
  h$stack[(h$sp - 7)] = x1;
  h$stack[(h$sp - 6)] = x2;
  h$stack[(h$sp - 4)] = x3;
  h$stack[(h$sp - 3)] = x4;
  h$stack[(h$sp - 0)] = x5;
};
function h$pp156(x1, x2, x3, x4)
{
  h$sp += 8;
  h$stack[(h$sp - 5)] = x1;
  h$stack[(h$sp - 4)] = x2;
  h$stack[(h$sp - 3)] = x3;
  h$stack[(h$sp - 0)] = x4;
};
function h$pp157(x1, x2, x3, x4, x5)
{
  h$sp += 8;
  h$stack[(h$sp - 7)] = x1;
  h$stack[(h$sp - 5)] = x2;
  h$stack[(h$sp - 4)] = x3;
  h$stack[(h$sp - 3)] = x4;
  h$stack[(h$sp - 0)] = x5;
};
function h$pp158(x1, x2, x3, x4, x5)
{
  h$sp += 8;
  h$stack[(h$sp - 6)] = x1;
  h$stack[(h$sp - 5)] = x2;
  h$stack[(h$sp - 4)] = x3;
  h$stack[(h$sp - 3)] = x4;
  h$stack[(h$sp - 0)] = x5;
};
function h$pp159(x1, x2, x3, x4, x5, x6)
{
  h$sp += 8;
  h$stack[(h$sp - 7)] = x1;
  h$stack[(h$sp - 6)] = x2;
  h$stack[(h$sp - 5)] = x3;
  h$stack[(h$sp - 4)] = x4;
  h$stack[(h$sp - 3)] = x5;
  h$stack[(h$sp - 0)] = x6;
};
function h$pp160(x1, x2)
{
  h$sp += 8;
  h$stack[(h$sp - 2)] = x1;
  h$stack[(h$sp - 0)] = x2;
};
function h$pp161(x1, x2, x3)
{
  h$sp += 8;
  h$stack[(h$sp - 7)] = x1;
  h$stack[(h$sp - 2)] = x2;
  h$stack[(h$sp - 0)] = x3;
};
function h$pp162(x1, x2, x3)
{
  h$sp += 8;
  h$stack[(h$sp - 6)] = x1;
  h$stack[(h$sp - 2)] = x2;
  h$stack[(h$sp - 0)] = x3;
};
function h$pp163(x1, x2, x3, x4)
{
  h$sp += 8;
  h$stack[(h$sp - 7)] = x1;
  h$stack[(h$sp - 6)] = x2;
  h$stack[(h$sp - 2)] = x3;
  h$stack[(h$sp - 0)] = x4;
};
function h$pp164(x1, x2, x3)
{
  h$sp += 8;
  h$stack[(h$sp - 5)] = x1;
  h$stack[(h$sp - 2)] = x2;
  h$stack[(h$sp - 0)] = x3;
};
function h$pp165(x1, x2, x3, x4)
{
  h$sp += 8;
  h$stack[(h$sp - 7)] = x1;
  h$stack[(h$sp - 5)] = x2;
  h$stack[(h$sp - 2)] = x3;
  h$stack[(h$sp - 0)] = x4;
};
function h$pp166(x1, x2, x3, x4)
{
  h$sp += 8;
  h$stack[(h$sp - 6)] = x1;
  h$stack[(h$sp - 5)] = x2;
  h$stack[(h$sp - 2)] = x3;
  h$stack[(h$sp - 0)] = x4;
};
function h$pp167(x1, x2, x3, x4, x5)
{
  h$sp += 8;
  h$stack[(h$sp - 7)] = x1;
  h$stack[(h$sp - 6)] = x2;
  h$stack[(h$sp - 5)] = x3;
  h$stack[(h$sp - 2)] = x4;
  h$stack[(h$sp - 0)] = x5;
};
function h$pp168(x1, x2, x3)
{
  h$sp += 8;
  h$stack[(h$sp - 4)] = x1;
  h$stack[(h$sp - 2)] = x2;
  h$stack[(h$sp - 0)] = x3;
};
function h$pp169(x1, x2, x3, x4)
{
  h$sp += 8;
  h$stack[(h$sp - 7)] = x1;
  h$stack[(h$sp - 4)] = x2;
  h$stack[(h$sp - 2)] = x3;
  h$stack[(h$sp - 0)] = x4;
};
function h$pp170(x1, x2, x3, x4)
{
  h$sp += 8;
  h$stack[(h$sp - 6)] = x1;
  h$stack[(h$sp - 4)] = x2;
  h$stack[(h$sp - 2)] = x3;
  h$stack[(h$sp - 0)] = x4;
};
function h$pp171(x1, x2, x3, x4, x5)
{
  h$sp += 8;
  h$stack[(h$sp - 7)] = x1;
  h$stack[(h$sp - 6)] = x2;
  h$stack[(h$sp - 4)] = x3;
  h$stack[(h$sp - 2)] = x4;
  h$stack[(h$sp - 0)] = x5;
};
function h$pp172(x1, x2, x3, x4)
{
  h$sp += 8;
  h$stack[(h$sp - 5)] = x1;
  h$stack[(h$sp - 4)] = x2;
  h$stack[(h$sp - 2)] = x3;
  h$stack[(h$sp - 0)] = x4;
};
function h$pp173(x1, x2, x3, x4, x5)
{
  h$sp += 8;
  h$stack[(h$sp - 7)] = x1;
  h$stack[(h$sp - 5)] = x2;
  h$stack[(h$sp - 4)] = x3;
  h$stack[(h$sp - 2)] = x4;
  h$stack[(h$sp - 0)] = x5;
};
function h$pp174(x1, x2, x3, x4, x5)
{
  h$sp += 8;
  h$stack[(h$sp - 6)] = x1;
  h$stack[(h$sp - 5)] = x2;
  h$stack[(h$sp - 4)] = x3;
  h$stack[(h$sp - 2)] = x4;
  h$stack[(h$sp - 0)] = x5;
};
function h$pp175(x1, x2, x3, x4, x5, x6)
{
  h$sp += 8;
  h$stack[(h$sp - 7)] = x1;
  h$stack[(h$sp - 6)] = x2;
  h$stack[(h$sp - 5)] = x3;
  h$stack[(h$sp - 4)] = x4;
  h$stack[(h$sp - 2)] = x5;
  h$stack[(h$sp - 0)] = x6;
};
function h$pp176(x1, x2, x3)
{
  h$sp += 8;
  h$stack[(h$sp - 3)] = x1;
  h$stack[(h$sp - 2)] = x2;
  h$stack[(h$sp - 0)] = x3;
};
function h$pp177(x1, x2, x3, x4)
{
  h$sp += 8;
  h$stack[(h$sp - 7)] = x1;
  h$stack[(h$sp - 3)] = x2;
  h$stack[(h$sp - 2)] = x3;
  h$stack[(h$sp - 0)] = x4;
};
function h$pp178(x1, x2, x3, x4)
{
  h$sp += 8;
  h$stack[(h$sp - 6)] = x1;
  h$stack[(h$sp - 3)] = x2;
  h$stack[(h$sp - 2)] = x3;
  h$stack[(h$sp - 0)] = x4;
};
function h$pp179(x1, x2, x3, x4, x5)
{
  h$sp += 8;
  h$stack[(h$sp - 7)] = x1;
  h$stack[(h$sp - 6)] = x2;
  h$stack[(h$sp - 3)] = x3;
  h$stack[(h$sp - 2)] = x4;
  h$stack[(h$sp - 0)] = x5;
};
function h$pp180(x1, x2, x3, x4)
{
  h$sp += 8;
  h$stack[(h$sp - 5)] = x1;
  h$stack[(h$sp - 3)] = x2;
  h$stack[(h$sp - 2)] = x3;
  h$stack[(h$sp - 0)] = x4;
};
function h$pp181(x1, x2, x3, x4, x5)
{
  h$sp += 8;
  h$stack[(h$sp - 7)] = x1;
  h$stack[(h$sp - 5)] = x2;
  h$stack[(h$sp - 3)] = x3;
  h$stack[(h$sp - 2)] = x4;
  h$stack[(h$sp - 0)] = x5;
};
function h$pp182(x1, x2, x3, x4, x5)
{
  h$sp += 8;
  h$stack[(h$sp - 6)] = x1;
  h$stack[(h$sp - 5)] = x2;
  h$stack[(h$sp - 3)] = x3;
  h$stack[(h$sp - 2)] = x4;
  h$stack[(h$sp - 0)] = x5;
};
function h$pp183(x1, x2, x3, x4, x5, x6)
{
  h$sp += 8;
  h$stack[(h$sp - 7)] = x1;
  h$stack[(h$sp - 6)] = x2;
  h$stack[(h$sp - 5)] = x3;
  h$stack[(h$sp - 3)] = x4;
  h$stack[(h$sp - 2)] = x5;
  h$stack[(h$sp - 0)] = x6;
};
function h$pp184(x1, x2, x3, x4)
{
  h$sp += 8;
  h$stack[(h$sp - 4)] = x1;
  h$stack[(h$sp - 3)] = x2;
  h$stack[(h$sp - 2)] = x3;
  h$stack[(h$sp - 0)] = x4;
};
function h$pp185(x1, x2, x3, x4, x5)
{
  h$sp += 8;
  h$stack[(h$sp - 7)] = x1;
  h$stack[(h$sp - 4)] = x2;
  h$stack[(h$sp - 3)] = x3;
  h$stack[(h$sp - 2)] = x4;
  h$stack[(h$sp - 0)] = x5;
};
function h$pp186(x1, x2, x3, x4, x5)
{
  h$sp += 8;
  h$stack[(h$sp - 6)] = x1;
  h$stack[(h$sp - 4)] = x2;
  h$stack[(h$sp - 3)] = x3;
  h$stack[(h$sp - 2)] = x4;
  h$stack[(h$sp - 0)] = x5;
};
function h$pp187(x1, x2, x3, x4, x5, x6)
{
  h$sp += 8;
  h$stack[(h$sp - 7)] = x1;
  h$stack[(h$sp - 6)] = x2;
  h$stack[(h$sp - 4)] = x3;
  h$stack[(h$sp - 3)] = x4;
  h$stack[(h$sp - 2)] = x5;
  h$stack[(h$sp - 0)] = x6;
};
function h$pp188(x1, x2, x3, x4, x5)
{
  h$sp += 8;
  h$stack[(h$sp - 5)] = x1;
  h$stack[(h$sp - 4)] = x2;
  h$stack[(h$sp - 3)] = x3;
  h$stack[(h$sp - 2)] = x4;
  h$stack[(h$sp - 0)] = x5;
};
function h$pp189(x1, x2, x3, x4, x5, x6)
{
  h$sp += 8;
  h$stack[(h$sp - 7)] = x1;
  h$stack[(h$sp - 5)] = x2;
  h$stack[(h$sp - 4)] = x3;
  h$stack[(h$sp - 3)] = x4;
  h$stack[(h$sp - 2)] = x5;
  h$stack[(h$sp - 0)] = x6;
};
function h$pp190(x1, x2, x3, x4, x5, x6)
{
  h$sp += 8;
  h$stack[(h$sp - 6)] = x1;
  h$stack[(h$sp - 5)] = x2;
  h$stack[(h$sp - 4)] = x3;
  h$stack[(h$sp - 3)] = x4;
  h$stack[(h$sp - 2)] = x5;
  h$stack[(h$sp - 0)] = x6;
};
function h$pp191(x1, x2, x3, x4, x5, x6, x7)
{
  h$sp += 8;
  h$stack[(h$sp - 7)] = x1;
  h$stack[(h$sp - 6)] = x2;
  h$stack[(h$sp - 5)] = x3;
  h$stack[(h$sp - 4)] = x4;
  h$stack[(h$sp - 3)] = x5;
  h$stack[(h$sp - 2)] = x6;
  h$stack[(h$sp - 0)] = x7;
};
function h$pp192(x1, x2)
{
  h$sp += 8;
  h$stack[(h$sp - 1)] = x1;
  h$stack[(h$sp - 0)] = x2;
};
function h$pp193(x1, x2, x3)
{
  h$sp += 8;
  h$stack[(h$sp - 7)] = x1;
  h$stack[(h$sp - 1)] = x2;
  h$stack[(h$sp - 0)] = x3;
};
function h$pp194(x1, x2, x3)
{
  h$sp += 8;
  h$stack[(h$sp - 6)] = x1;
  h$stack[(h$sp - 1)] = x2;
  h$stack[(h$sp - 0)] = x3;
};
function h$pp195(x1, x2, x3, x4)
{
  h$sp += 8;
  h$stack[(h$sp - 7)] = x1;
  h$stack[(h$sp - 6)] = x2;
  h$stack[(h$sp - 1)] = x3;
  h$stack[(h$sp - 0)] = x4;
};
function h$pp196(x1, x2, x3)
{
  h$sp += 8;
  h$stack[(h$sp - 5)] = x1;
  h$stack[(h$sp - 1)] = x2;
  h$stack[(h$sp - 0)] = x3;
};
function h$pp197(x1, x2, x3, x4)
{
  h$sp += 8;
  h$stack[(h$sp - 7)] = x1;
  h$stack[(h$sp - 5)] = x2;
  h$stack[(h$sp - 1)] = x3;
  h$stack[(h$sp - 0)] = x4;
};
function h$pp198(x1, x2, x3, x4)
{
  h$sp += 8;
  h$stack[(h$sp - 6)] = x1;
  h$stack[(h$sp - 5)] = x2;
  h$stack[(h$sp - 1)] = x3;
  h$stack[(h$sp - 0)] = x4;
};
function h$pp199(x1, x2, x3, x4, x5)
{
  h$sp += 8;
  h$stack[(h$sp - 7)] = x1;
  h$stack[(h$sp - 6)] = x2;
  h$stack[(h$sp - 5)] = x3;
  h$stack[(h$sp - 1)] = x4;
  h$stack[(h$sp - 0)] = x5;
};
function h$pp200(x1, x2, x3)
{
  h$sp += 8;
  h$stack[(h$sp - 4)] = x1;
  h$stack[(h$sp - 1)] = x2;
  h$stack[(h$sp - 0)] = x3;
};
function h$pp201(x1, x2, x3, x4)
{
  h$sp += 8;
  h$stack[(h$sp - 7)] = x1;
  h$stack[(h$sp - 4)] = x2;
  h$stack[(h$sp - 1)] = x3;
  h$stack[(h$sp - 0)] = x4;
};
function h$pp202(x1, x2, x3, x4)
{
  h$sp += 8;
  h$stack[(h$sp - 6)] = x1;
  h$stack[(h$sp - 4)] = x2;
  h$stack[(h$sp - 1)] = x3;
  h$stack[(h$sp - 0)] = x4;
};
function h$pp203(x1, x2, x3, x4, x5)
{
  h$sp += 8;
  h$stack[(h$sp - 7)] = x1;
  h$stack[(h$sp - 6)] = x2;
  h$stack[(h$sp - 4)] = x3;
  h$stack[(h$sp - 1)] = x4;
  h$stack[(h$sp - 0)] = x5;
};
function h$pp204(x1, x2, x3, x4)
{
  h$sp += 8;
  h$stack[(h$sp - 5)] = x1;
  h$stack[(h$sp - 4)] = x2;
  h$stack[(h$sp - 1)] = x3;
  h$stack[(h$sp - 0)] = x4;
};
function h$pp205(x1, x2, x3, x4, x5)
{
  h$sp += 8;
  h$stack[(h$sp - 7)] = x1;
  h$stack[(h$sp - 5)] = x2;
  h$stack[(h$sp - 4)] = x3;
  h$stack[(h$sp - 1)] = x4;
  h$stack[(h$sp - 0)] = x5;
};
function h$pp206(x1, x2, x3, x4, x5)
{
  h$sp += 8;
  h$stack[(h$sp - 6)] = x1;
  h$stack[(h$sp - 5)] = x2;
  h$stack[(h$sp - 4)] = x3;
  h$stack[(h$sp - 1)] = x4;
  h$stack[(h$sp - 0)] = x5;
};
function h$pp207(x1, x2, x3, x4, x5, x6)
{
  h$sp += 8;
  h$stack[(h$sp - 7)] = x1;
  h$stack[(h$sp - 6)] = x2;
  h$stack[(h$sp - 5)] = x3;
  h$stack[(h$sp - 4)] = x4;
  h$stack[(h$sp - 1)] = x5;
  h$stack[(h$sp - 0)] = x6;
};
function h$pp208(x1, x2, x3)
{
  h$sp += 8;
  h$stack[(h$sp - 3)] = x1;
  h$stack[(h$sp - 1)] = x2;
  h$stack[(h$sp - 0)] = x3;
};
function h$pp209(x1, x2, x3, x4)
{
  h$sp += 8;
  h$stack[(h$sp - 7)] = x1;
  h$stack[(h$sp - 3)] = x2;
  h$stack[(h$sp - 1)] = x3;
  h$stack[(h$sp - 0)] = x4;
};
function h$pp210(x1, x2, x3, x4)
{
  h$sp += 8;
  h$stack[(h$sp - 6)] = x1;
  h$stack[(h$sp - 3)] = x2;
  h$stack[(h$sp - 1)] = x3;
  h$stack[(h$sp - 0)] = x4;
};
function h$pp211(x1, x2, x3, x4, x5)
{
  h$sp += 8;
  h$stack[(h$sp - 7)] = x1;
  h$stack[(h$sp - 6)] = x2;
  h$stack[(h$sp - 3)] = x3;
  h$stack[(h$sp - 1)] = x4;
  h$stack[(h$sp - 0)] = x5;
};
function h$pp212(x1, x2, x3, x4)
{
  h$sp += 8;
  h$stack[(h$sp - 5)] = x1;
  h$stack[(h$sp - 3)] = x2;
  h$stack[(h$sp - 1)] = x3;
  h$stack[(h$sp - 0)] = x4;
};
function h$pp213(x1, x2, x3, x4, x5)
{
  h$sp += 8;
  h$stack[(h$sp - 7)] = x1;
  h$stack[(h$sp - 5)] = x2;
  h$stack[(h$sp - 3)] = x3;
  h$stack[(h$sp - 1)] = x4;
  h$stack[(h$sp - 0)] = x5;
};
function h$pp214(x1, x2, x3, x4, x5)
{
  h$sp += 8;
  h$stack[(h$sp - 6)] = x1;
  h$stack[(h$sp - 5)] = x2;
  h$stack[(h$sp - 3)] = x3;
  h$stack[(h$sp - 1)] = x4;
  h$stack[(h$sp - 0)] = x5;
};
function h$pp215(x1, x2, x3, x4, x5, x6)
{
  h$sp += 8;
  h$stack[(h$sp - 7)] = x1;
  h$stack[(h$sp - 6)] = x2;
  h$stack[(h$sp - 5)] = x3;
  h$stack[(h$sp - 3)] = x4;
  h$stack[(h$sp - 1)] = x5;
  h$stack[(h$sp - 0)] = x6;
};
function h$pp216(x1, x2, x3, x4)
{
  h$sp += 8;
  h$stack[(h$sp - 4)] = x1;
  h$stack[(h$sp - 3)] = x2;
  h$stack[(h$sp - 1)] = x3;
  h$stack[(h$sp - 0)] = x4;
};
function h$pp217(x1, x2, x3, x4, x5)
{
  h$sp += 8;
  h$stack[(h$sp - 7)] = x1;
  h$stack[(h$sp - 4)] = x2;
  h$stack[(h$sp - 3)] = x3;
  h$stack[(h$sp - 1)] = x4;
  h$stack[(h$sp - 0)] = x5;
};
function h$pp218(x1, x2, x3, x4, x5)
{
  h$sp += 8;
  h$stack[(h$sp - 6)] = x1;
  h$stack[(h$sp - 4)] = x2;
  h$stack[(h$sp - 3)] = x3;
  h$stack[(h$sp - 1)] = x4;
  h$stack[(h$sp - 0)] = x5;
};
function h$pp219(x1, x2, x3, x4, x5, x6)
{
  h$sp += 8;
  h$stack[(h$sp - 7)] = x1;
  h$stack[(h$sp - 6)] = x2;
  h$stack[(h$sp - 4)] = x3;
  h$stack[(h$sp - 3)] = x4;
  h$stack[(h$sp - 1)] = x5;
  h$stack[(h$sp - 0)] = x6;
};
function h$pp220(x1, x2, x3, x4, x5)
{
  h$sp += 8;
  h$stack[(h$sp - 5)] = x1;
  h$stack[(h$sp - 4)] = x2;
  h$stack[(h$sp - 3)] = x3;
  h$stack[(h$sp - 1)] = x4;
  h$stack[(h$sp - 0)] = x5;
};
function h$pp221(x1, x2, x3, x4, x5, x6)
{
  h$sp += 8;
  h$stack[(h$sp - 7)] = x1;
  h$stack[(h$sp - 5)] = x2;
  h$stack[(h$sp - 4)] = x3;
  h$stack[(h$sp - 3)] = x4;
  h$stack[(h$sp - 1)] = x5;
  h$stack[(h$sp - 0)] = x6;
};
function h$pp222(x1, x2, x3, x4, x5, x6)
{
  h$sp += 8;
  h$stack[(h$sp - 6)] = x1;
  h$stack[(h$sp - 5)] = x2;
  h$stack[(h$sp - 4)] = x3;
  h$stack[(h$sp - 3)] = x4;
  h$stack[(h$sp - 1)] = x5;
  h$stack[(h$sp - 0)] = x6;
};
function h$pp223(x1, x2, x3, x4, x5, x6, x7)
{
  h$sp += 8;
  h$stack[(h$sp - 7)] = x1;
  h$stack[(h$sp - 6)] = x2;
  h$stack[(h$sp - 5)] = x3;
  h$stack[(h$sp - 4)] = x4;
  h$stack[(h$sp - 3)] = x5;
  h$stack[(h$sp - 1)] = x6;
  h$stack[(h$sp - 0)] = x7;
};
function h$pp224(x1, x2, x3)
{
  h$sp += 8;
  h$stack[(h$sp - 2)] = x1;
  h$stack[(h$sp - 1)] = x2;
  h$stack[(h$sp - 0)] = x3;
};
function h$pp225(x1, x2, x3, x4)
{
  h$sp += 8;
  h$stack[(h$sp - 7)] = x1;
  h$stack[(h$sp - 2)] = x2;
  h$stack[(h$sp - 1)] = x3;
  h$stack[(h$sp - 0)] = x4;
};
function h$pp226(x1, x2, x3, x4)
{
  h$sp += 8;
  h$stack[(h$sp - 6)] = x1;
  h$stack[(h$sp - 2)] = x2;
  h$stack[(h$sp - 1)] = x3;
  h$stack[(h$sp - 0)] = x4;
};
function h$pp227(x1, x2, x3, x4, x5)
{
  h$sp += 8;
  h$stack[(h$sp - 7)] = x1;
  h$stack[(h$sp - 6)] = x2;
  h$stack[(h$sp - 2)] = x3;
  h$stack[(h$sp - 1)] = x4;
  h$stack[(h$sp - 0)] = x5;
};
function h$pp228(x1, x2, x3, x4)
{
  h$sp += 8;
  h$stack[(h$sp - 5)] = x1;
  h$stack[(h$sp - 2)] = x2;
  h$stack[(h$sp - 1)] = x3;
  h$stack[(h$sp - 0)] = x4;
};
function h$pp229(x1, x2, x3, x4, x5)
{
  h$sp += 8;
  h$stack[(h$sp - 7)] = x1;
  h$stack[(h$sp - 5)] = x2;
  h$stack[(h$sp - 2)] = x3;
  h$stack[(h$sp - 1)] = x4;
  h$stack[(h$sp - 0)] = x5;
};
function h$pp230(x1, x2, x3, x4, x5)
{
  h$sp += 8;
  h$stack[(h$sp - 6)] = x1;
  h$stack[(h$sp - 5)] = x2;
  h$stack[(h$sp - 2)] = x3;
  h$stack[(h$sp - 1)] = x4;
  h$stack[(h$sp - 0)] = x5;
};
function h$pp231(x1, x2, x3, x4, x5, x6)
{
  h$sp += 8;
  h$stack[(h$sp - 7)] = x1;
  h$stack[(h$sp - 6)] = x2;
  h$stack[(h$sp - 5)] = x3;
  h$stack[(h$sp - 2)] = x4;
  h$stack[(h$sp - 1)] = x5;
  h$stack[(h$sp - 0)] = x6;
};
function h$pp232(x1, x2, x3, x4)
{
  h$sp += 8;
  h$stack[(h$sp - 4)] = x1;
  h$stack[(h$sp - 2)] = x2;
  h$stack[(h$sp - 1)] = x3;
  h$stack[(h$sp - 0)] = x4;
};
function h$pp233(x1, x2, x3, x4, x5)
{
  h$sp += 8;
  h$stack[(h$sp - 7)] = x1;
  h$stack[(h$sp - 4)] = x2;
  h$stack[(h$sp - 2)] = x3;
  h$stack[(h$sp - 1)] = x4;
  h$stack[(h$sp - 0)] = x5;
};
function h$pp234(x1, x2, x3, x4, x5)
{
  h$sp += 8;
  h$stack[(h$sp - 6)] = x1;
  h$stack[(h$sp - 4)] = x2;
  h$stack[(h$sp - 2)] = x3;
  h$stack[(h$sp - 1)] = x4;
  h$stack[(h$sp - 0)] = x5;
};
function h$pp235(x1, x2, x3, x4, x5, x6)
{
  h$sp += 8;
  h$stack[(h$sp - 7)] = x1;
  h$stack[(h$sp - 6)] = x2;
  h$stack[(h$sp - 4)] = x3;
  h$stack[(h$sp - 2)] = x4;
  h$stack[(h$sp - 1)] = x5;
  h$stack[(h$sp - 0)] = x6;
};
function h$pp236(x1, x2, x3, x4, x5)
{
  h$sp += 8;
  h$stack[(h$sp - 5)] = x1;
  h$stack[(h$sp - 4)] = x2;
  h$stack[(h$sp - 2)] = x3;
  h$stack[(h$sp - 1)] = x4;
  h$stack[(h$sp - 0)] = x5;
};
function h$pp237(x1, x2, x3, x4, x5, x6)
{
  h$sp += 8;
  h$stack[(h$sp - 7)] = x1;
  h$stack[(h$sp - 5)] = x2;
  h$stack[(h$sp - 4)] = x3;
  h$stack[(h$sp - 2)] = x4;
  h$stack[(h$sp - 1)] = x5;
  h$stack[(h$sp - 0)] = x6;
};
function h$pp238(x1, x2, x3, x4, x5, x6)
{
  h$sp += 8;
  h$stack[(h$sp - 6)] = x1;
  h$stack[(h$sp - 5)] = x2;
  h$stack[(h$sp - 4)] = x3;
  h$stack[(h$sp - 2)] = x4;
  h$stack[(h$sp - 1)] = x5;
  h$stack[(h$sp - 0)] = x6;
};
function h$pp239(x1, x2, x3, x4, x5, x6, x7)
{
  h$sp += 8;
  h$stack[(h$sp - 7)] = x1;
  h$stack[(h$sp - 6)] = x2;
  h$stack[(h$sp - 5)] = x3;
  h$stack[(h$sp - 4)] = x4;
  h$stack[(h$sp - 2)] = x5;
  h$stack[(h$sp - 1)] = x6;
  h$stack[(h$sp - 0)] = x7;
};
function h$pp240(x1, x2, x3, x4)
{
  h$sp += 8;
  h$stack[(h$sp - 3)] = x1;
  h$stack[(h$sp - 2)] = x2;
  h$stack[(h$sp - 1)] = x3;
  h$stack[(h$sp - 0)] = x4;
};
function h$pp241(x1, x2, x3, x4, x5)
{
  h$sp += 8;
  h$stack[(h$sp - 7)] = x1;
  h$stack[(h$sp - 3)] = x2;
  h$stack[(h$sp - 2)] = x3;
  h$stack[(h$sp - 1)] = x4;
  h$stack[(h$sp - 0)] = x5;
};
function h$pp242(x1, x2, x3, x4, x5)
{
  h$sp += 8;
  h$stack[(h$sp - 6)] = x1;
  h$stack[(h$sp - 3)] = x2;
  h$stack[(h$sp - 2)] = x3;
  h$stack[(h$sp - 1)] = x4;
  h$stack[(h$sp - 0)] = x5;
};
function h$pp243(x1, x2, x3, x4, x5, x6)
{
  h$sp += 8;
  h$stack[(h$sp - 7)] = x1;
  h$stack[(h$sp - 6)] = x2;
  h$stack[(h$sp - 3)] = x3;
  h$stack[(h$sp - 2)] = x4;
  h$stack[(h$sp - 1)] = x5;
  h$stack[(h$sp - 0)] = x6;
};
function h$pp244(x1, x2, x3, x4, x5)
{
  h$sp += 8;
  h$stack[(h$sp - 5)] = x1;
  h$stack[(h$sp - 3)] = x2;
  h$stack[(h$sp - 2)] = x3;
  h$stack[(h$sp - 1)] = x4;
  h$stack[(h$sp - 0)] = x5;
};
function h$pp245(x1, x2, x3, x4, x5, x6)
{
  h$sp += 8;
  h$stack[(h$sp - 7)] = x1;
  h$stack[(h$sp - 5)] = x2;
  h$stack[(h$sp - 3)] = x3;
  h$stack[(h$sp - 2)] = x4;
  h$stack[(h$sp - 1)] = x5;
  h$stack[(h$sp - 0)] = x6;
};
function h$pp246(x1, x2, x3, x4, x5, x6)
{
  h$sp += 8;
  h$stack[(h$sp - 6)] = x1;
  h$stack[(h$sp - 5)] = x2;
  h$stack[(h$sp - 3)] = x3;
  h$stack[(h$sp - 2)] = x4;
  h$stack[(h$sp - 1)] = x5;
  h$stack[(h$sp - 0)] = x6;
};
function h$pp247(x1, x2, x3, x4, x5, x6, x7)
{
  h$sp += 8;
  h$stack[(h$sp - 7)] = x1;
  h$stack[(h$sp - 6)] = x2;
  h$stack[(h$sp - 5)] = x3;
  h$stack[(h$sp - 3)] = x4;
  h$stack[(h$sp - 2)] = x5;
  h$stack[(h$sp - 1)] = x6;
  h$stack[(h$sp - 0)] = x7;
};
function h$pp248(x1, x2, x3, x4, x5)
{
  h$sp += 8;
  h$stack[(h$sp - 4)] = x1;
  h$stack[(h$sp - 3)] = x2;
  h$stack[(h$sp - 2)] = x3;
  h$stack[(h$sp - 1)] = x4;
  h$stack[(h$sp - 0)] = x5;
};
function h$pp249(x1, x2, x3, x4, x5, x6)
{
  h$sp += 8;
  h$stack[(h$sp - 7)] = x1;
  h$stack[(h$sp - 4)] = x2;
  h$stack[(h$sp - 3)] = x3;
  h$stack[(h$sp - 2)] = x4;
  h$stack[(h$sp - 1)] = x5;
  h$stack[(h$sp - 0)] = x6;
};
function h$pp250(x1, x2, x3, x4, x5, x6)
{
  h$sp += 8;
  h$stack[(h$sp - 6)] = x1;
  h$stack[(h$sp - 4)] = x2;
  h$stack[(h$sp - 3)] = x3;
  h$stack[(h$sp - 2)] = x4;
  h$stack[(h$sp - 1)] = x5;
  h$stack[(h$sp - 0)] = x6;
};
function h$pp251(x1, x2, x3, x4, x5, x6, x7)
{
  h$sp += 8;
  h$stack[(h$sp - 7)] = x1;
  h$stack[(h$sp - 6)] = x2;
  h$stack[(h$sp - 4)] = x3;
  h$stack[(h$sp - 3)] = x4;
  h$stack[(h$sp - 2)] = x5;
  h$stack[(h$sp - 1)] = x6;
  h$stack[(h$sp - 0)] = x7;
};
function h$pp252(x1, x2, x3, x4, x5, x6)
{
  h$sp += 8;
  h$stack[(h$sp - 5)] = x1;
  h$stack[(h$sp - 4)] = x2;
  h$stack[(h$sp - 3)] = x3;
  h$stack[(h$sp - 2)] = x4;
  h$stack[(h$sp - 1)] = x5;
  h$stack[(h$sp - 0)] = x6;
};
function h$pp253(x1, x2, x3, x4, x5, x6, x7)
{
  h$sp += 8;
  h$stack[(h$sp - 7)] = x1;
  h$stack[(h$sp - 5)] = x2;
  h$stack[(h$sp - 4)] = x3;
  h$stack[(h$sp - 3)] = x4;
  h$stack[(h$sp - 2)] = x5;
  h$stack[(h$sp - 1)] = x6;
  h$stack[(h$sp - 0)] = x7;
};
function h$pp254(x1, x2, x3, x4, x5, x6, x7)
{
  h$sp += 8;
  h$stack[(h$sp - 6)] = x1;
  h$stack[(h$sp - 5)] = x2;
  h$stack[(h$sp - 4)] = x3;
  h$stack[(h$sp - 3)] = x4;
  h$stack[(h$sp - 2)] = x5;
  h$stack[(h$sp - 1)] = x6;
  h$stack[(h$sp - 0)] = x7;
};
function h$bh()
{
  h$p2(h$r1, h$upd_frame);
  h$r1.f = h$blackhole;
  h$r1.d1 = h$currentThread;
  h$r1.d2 = null;
};
function h$bh_lne(h$RTS_26, h$RTS_27)
{
  var h$RTS_28 = h$stack[h$RTS_26];
  if(h$RTS_28)
  {
    h$sp -= h$RTS_27;
    if((h$RTS_28 === h$blackhole))
    {
      return h$throw(h$baseZCControlziExceptionziBasezinonTermination, false);
    }
    else
    {
      h$r1 = h$RTS_28;
      h$sp -= h$RTS_27;
      return h$rs();
    };
  }
  else
  {
    h$stack[h$RTS_26] = h$blackhole;
    return null;
  };
};
function h$blackhole()
{
  throw("oops: entered black hole");
  return 0;
};
h$o(h$blackhole, 5, 0, 2, 0, null);
function h$blackholeTrap()
{
  throw("oops: entered multiple times");
  return 0;
};
h$o(h$blackholeTrap, 0, 0, 2, 0, null);
function h$done(h$RTS_29)
{
  h$finishThread(h$currentThread);
  return h$reschedule;
};
h$o(h$done, (-1), 0, 0, 256, null);
function h$doneMain_e()
{
  return h$doneMain();
};
h$o(h$doneMain, (-1), 0, 0, 256, null);
function h$false_e()
{
  return h$stack[h$sp];
};
h$o(h$false_e, 2, 1, 0, 256, null);
function h$true_e()
{
  return h$stack[h$sp];
};
h$o(h$true_e, 2, 2, 0, 256, null);
function h$integerzmgmpZCGHCziIntegerziTypeziSzh_con_e()
{
  return h$stack[h$sp];
};
h$o(h$integerzmgmpZCGHCziIntegerziTypeziSzh_con_e, 2, 1, 1, 256, null);
function h$integerzmgmpZCGHCziIntegerziTypeziJpzh_con_e()
{
  return h$stack[h$sp];
};
h$o(h$integerzmgmpZCGHCziIntegerziTypeziJpzh_con_e, 2, 2, 1, 256, null);
function h$integerzmgmpZCGHCziIntegerziTypeziJnzh_con_e()
{
  return h$stack[h$sp];
};
h$o(h$integerzmgmpZCGHCziIntegerziTypeziJnzh_con_e, 2, 3, 1, 256, null);
function h$data1_e()
{
  return h$stack[h$sp];
};
h$o(h$data1_e, 2, 1, 1, 256, null);
function h$data2_e()
{
  return h$stack[h$sp];
};
h$o(h$data2_e, 2, 1, 2, 256, null);
function h$con_e()
{
  return h$stack[h$sp];
};
function h$catch(h$RTS_30, h$RTS_31)
{
  h$sp += 3;
  h$stack[(h$sp - 2)] = h$currentThread.mask;
  h$stack[(h$sp - 1)] = h$RTS_31;
  h$stack[h$sp] = h$catch_e;
  h$r1 = h$RTS_30;
  return h$ap_1_0_fast();
};
function h$noop_e()
{
  return h$stack[h$sp];
};
h$o(h$noop_e, 1, 1, 0, 257, null);
var h$noop = h$c0(h$noop_e);
function h$catch_e()
{
  h$sp -= 3;
  return h$stack[h$sp];
};
h$o(h$catch_e, (-1), 0, 2, 256, null);
function h$ap1_e()
{
  var h$RTS_32 = h$r1.d1;
  var h$RTS_33 = h$r1.d2;
  h$bh();
  h$r1 = h$RTS_32;
  h$r2 = h$RTS_33;
  return h$ap_1_1_fast();
};
h$o(h$ap1_e, 0, 0, 2, 256, null);
function h$ap2_e()
{
  var h$RTS_34 = h$r1.d1;
  var h$RTS_35 = h$r1.d2.d1;
  var h$RTS_36 = h$r1.d2.d2;
  h$bh();
  h$r1 = h$RTS_34;
  h$r2 = h$RTS_35;
  h$r3 = h$RTS_36;
  return h$ap_2_2_fast();
};
h$o(h$ap2_e, 0, 0, 3, 256, null);
function h$ap3_e()
{
  var h$RTS_37 = h$r1.d1;
  var h$RTS_38 = h$r1.d2.d1;
  var h$RTS_39 = h$r1.d2.d2;
  var h$RTS_40 = h$r1.d2.d3;
  h$bh();
  h$r1 = h$RTS_37;
  h$r2 = h$RTS_38;
  h$r3 = h$RTS_39;
  h$r4 = h$RTS_40;
  return h$ap_3_3_fast();
};
h$o(h$ap3_e, 0, 0, 4, 256, null);
function h$select1_e()
{
  var h$RTS_41 = h$r1.d1;
  h$sp += 3;
  h$stack[(h$sp - 2)] = h$r1;
  h$stack[(h$sp - 1)] = h$upd_frame;
  h$stack[h$sp] = h$select1_ret;
  h$r1.f = h$blackhole;
  h$r1.d1 = h$currentThread;
  h$r1.d2 = null;
  h$r1 = h$RTS_41;
  return h$ap_0_0_fast();
};
h$o(h$select1_e, 0, 0, 1, 256, null);
function h$select1_ret()
{
  h$r1 = h$r1.d1;
  --h$sp;
  return h$ap_0_0_fast();
};
h$o(h$select1_ret, (-1), 0, 0, 256, null);
function h$select2_e()
{
  var h$RTS_42 = h$r1.d1;
  h$sp += 3;
  h$stack[(h$sp - 2)] = h$r1;
  h$stack[(h$sp - 1)] = h$upd_frame;
  h$stack[h$sp] = h$select2_ret;
  h$r1.f = h$blackhole;
  h$r1.d1 = h$currentThread;
  h$r1.d2 = null;
  h$r1 = h$RTS_42;
  return h$ap_0_0_fast();
};
h$o(h$select2_e, 0, 0, 1, 256, null);
function h$select2_ret()
{
  h$r1 = h$r1.d2;
  --h$sp;
  return h$ap_0_0_fast();
};
h$o(h$select2_ret, (-1), 0, 0, 256, null);
function h$throw(h$RTS_43, h$RTS_44)
{
  var h$RTS_45 = h$sp;
  var h$RTS_46 = null;
  var h$RTS_47;
  while((h$sp > 0))
  {
    h$RTS_47 = h$stack[h$sp];
    if(((h$RTS_47 === null) || (h$RTS_47 === undefined)))
    {
      throw("h$throw: invalid object while unwinding stack");
    };
    if((h$RTS_47 === h$catch_e))
    {
      break;
    };
    if((h$RTS_47 === h$atomically_e))
    {
      if(h$RTS_44)
      {
        h$currentThread.transaction = null;
      }
      else
      {
        if(!h$stmValidateTransaction())
        {
          ++h$sp;
          h$stack[h$sp] = h$checkInvariants_e;
          return h$stmStartTransaction(h$stack[(h$sp - 2)]);
        };
      };
    };
    if(((h$RTS_47 === h$catchStm_e) && !h$RTS_44))
    {
      break;
    };
    if((h$RTS_47 === h$upd_frame))
    {
      var h$RTS_48 = h$stack[(h$sp - 1)];
      var h$RTS_49 = h$RTS_48.d2;
      if((h$RTS_49 !== null))
      {
        for(var h$RTS_50 = 0;(h$RTS_50 < h$RTS_49.length);(h$RTS_50++)) {
          h$wakeupThread(h$RTS_49[h$RTS_50]);
        };
      };
      if(h$RTS_44)
      {
        if((h$RTS_46 === null))
        {
          h$makeResumable(h$RTS_48, (h$sp + 1), h$RTS_45, []);
        }
        else
        {
          h$makeResumable(h$RTS_48, (h$sp + 1), (h$RTS_46 - 2), [h$ap_0_0, h$stack[(h$RTS_46 - 1)], h$return]);
        };
        h$RTS_46 = h$sp;
      }
      else
      {
        h$RTS_48.f = h$raise_e;
        h$RTS_48.d1 = h$RTS_43;
        h$RTS_48.d2 = null;
      };
    };
    var h$RTS_51;
    if((h$RTS_47 === h$ap_gen))
    {
      h$RTS_51 = ((h$stack[(h$sp - 1)] >> 8) + 2);
    }
    else
    {
      var h$RTS_52 = h$RTS_47.size;
      if((h$RTS_52 < 0))
      {
        h$RTS_51 = h$stack[(h$sp - 1)];
      }
      else
      {
        h$RTS_51 = ((h$RTS_52 & 255) + 1);
      };
    };
    h$sp -= h$RTS_51;
  };
  if((h$sp > 0))
  {
    var h$RTS_53 = h$stack[(h$sp - 2)];
    var h$RTS_54 = h$stack[(h$sp - 1)];
    if((h$RTS_47 === h$catchStm_e))
    {
      h$currentThread.transaction = h$stack[(h$sp - 3)];
      h$sp -= 4;
    }
    else
    {
      if((h$sp > 3))
      {
        h$sp -= 3;
      };
    };
    h$r1 = h$RTS_54;
    h$r2 = h$RTS_43;
    if((h$RTS_47 !== h$catchStm_e))
    {
      if((((h$RTS_53 === 0) && (h$stack[h$sp] !== h$maskFrame)) && (h$stack[h$sp] !== h$maskUnintFrame)))
      {
        h$stack[(h$sp + 1)] = h$unmaskFrame;
        ++h$sp;
      }
      else
      {
        if((h$RTS_53 === 1))
        {
          h$stack[(h$sp + 1)] = h$maskUnintFrame;
          ++h$sp;
        };
      };
      h$currentThread.mask = 2;
    };
    return h$ap_2_1_fast();
  }
  else
  {
    throw("unhandled exception in haskell thread");
  };
};
function h$raise_e()
{
  return h$throw(h$r1.d1, false);
};
h$o(h$raise_e, 0, 0, 0, 256, null);
function h$raiseAsync_e()
{
  return h$throw(h$r1.d1, true);
};
h$o(h$raiseAsync_e, 0, 0, 0, 256, null);
function h$raiseAsync_frame()
{
  var h$RTS_55 = h$stack[(h$sp - 1)];
  h$sp -= 2;
  return h$throw(h$RTS_55, true);
};
h$o(h$raiseAsync_frame, (-1), 0, 1, 0, null);
function h$reduce()
{
  if((h$r1.f.t === 0))
  {
    return h$r1.f;
  }
  else
  {
    --h$sp;
    return h$stack[h$sp];
  };
};
h$o(h$reduce, (-1), 0, 0, 256, null);
var h$RTS_56 = 0;
function h$gc_check(h$RTS_57)
{
  if((++h$RTS_56 > 1000))
  {
    for(var h$RTS_58 = (h$sp + 1);(h$RTS_58 < h$stack.length);(h$RTS_58++)) {
      h$stack[h$RTS_58] = null;
    };
    h$RTS_56 = 0;
  };
  return 0;
};
function h$o(h$RTS_59, h$RTS_60, h$RTS_61, h$RTS_62, h$RTS_63, h$RTS_64)
{
  h$setObjInfo(h$RTS_59, h$RTS_60, "", [], h$RTS_61, h$RTS_62, h$RTS_63, h$RTS_64);
};
function h$setObjInfo(h$RTS_65, h$RTS_66, h$RTS_67, h$RTS_68, h$RTS_69, h$RTS_70, h$RTS_71, h$RTS_72)
{
  h$RTS_65.t = h$RTS_66;
  h$RTS_65.i = h$RTS_68;
  h$RTS_65.n = h$RTS_67;
  h$RTS_65.a = h$RTS_69;
  h$RTS_65.r = h$RTS_71;
  h$RTS_65.s = h$RTS_72;
  h$RTS_65.m = 0;
  h$RTS_65.size = h$RTS_70;
};
function h$static_thunk(h$RTS_73)
{
  var h$RTS_74 = { d1: null, d2: null, f: h$RTS_73, m: 0
                 };
  h$CAFs.push(h$RTS_74);
  h$CAFsReset.push(h$RTS_73);
  return h$RTS_74;
};
function h$printcl(h$RTS_75)
{
  var h$RTS_76 = h$RTS_75.f;
  var h$RTS_77 = h$RTS_75.d1;
  var h$RTS_78 = "";
  switch (h$RTS_76.t)
  {
    case (0):
      h$RTS_78 += "thunk";
      break;
    case (2):
      h$RTS_78 += (("con[" + h$RTS_76.a) + "]");
      break;
    case (3):
      h$RTS_78 += (("pap[" + h$RTS_76.a) + "]");
      break;
    case (1):
      h$RTS_78 += (("fun[" + h$RTS_76.a) + "]");
      break;
    default:
      h$RTS_78 += "unknown closure type";
      break;
  };
  h$RTS_78 += ((" :: " + h$RTS_76.n) + " ->");
  var h$RTS_79 = 1;
  for(var h$RTS_80 = 0;(h$RTS_80 < h$RTS_76.i.length);(h$RTS_80++)) {
    h$RTS_78 += " ";
    switch (h$RTS_76.i[h$RTS_80])
    {
      case (0):
        h$RTS_78 += (("[ Ptr :: " + h$RTS_77[("d" + h$RTS_79)].f.n) + "]");
        h$RTS_79++;
        break;
      case (1):
        h$RTS_78 += "void";
        break;
      case (2):
        h$RTS_78 += (("(" + h$RTS_77[("d" + h$RTS_79)]) + " :: double)");
        h$RTS_79++;
        break;
      case (3):
        h$RTS_78 += (("(" + h$RTS_77[("d" + h$RTS_79)]) + " :: int)");
        h$RTS_79++;
        break;
      case (4):
        h$RTS_78 += (((("(" + h$RTS_77[("d" + h$RTS_79)]) + ",") + h$RTS_77[("d" + (h$RTS_79 + 1))]) + " :: long)");
        h$RTS_79 += 2;
        break;
      case (5):
        h$RTS_78 += (((("(" + h$RTS_77[("d" + h$RTS_79)].length) + ",") + h$RTS_77[("d" + (h$RTS_79 + 1))]) + " :: ptr)");
        h$RTS_79 += 2;
        break;
      case (6):
        h$RTS_78 += (("(" + h$RTS_77[("d" + h$RTS_79)].toString()) + " :: RTS object)");
        h$RTS_79++;
        break;
      default:
        h$RTS_78 += ("unknown field: " + h$RTS_76.i[h$RTS_80]);
    };
  };
  h$log(h$RTS_78);
};
function h$init_closure(h$RTS_81, h$RTS_82)
{
  h$RTS_81.m = 0;
  switch (h$RTS_82.length)
  {
    case (0):
      h$RTS_81.d1 = null;
      h$RTS_81.d2 = null;
      return h$RTS_81;
    case (1):
      h$RTS_81.d1 = h$RTS_82[0];
      h$RTS_81.d2 = null;
      return h$RTS_81;
    case (2):
      h$RTS_81.d1 = h$RTS_82[0];
      h$RTS_81.d2 = h$RTS_82[1];
      return h$RTS_81;
    case (3):
      h$RTS_81.d1 = h$RTS_82[0];
      h$RTS_81.d2 = { d1: h$RTS_82[1], d2: h$RTS_82[2]
                    };
      return h$RTS_81;
    case (4):
      h$RTS_81.d1 = h$RTS_82[0];
      h$RTS_81.d2 = { d1: h$RTS_82[1], d2: h$RTS_82[2], d3: h$RTS_82[3]
                    };
      return h$RTS_81;
    case (5):
      h$RTS_81.d1 = h$RTS_82[0];
      h$RTS_81.d2 = { d1: h$RTS_82[1], d2: h$RTS_82[2], d3: h$RTS_82[3], d4: h$RTS_82[4]
                    };
      return h$RTS_81;
    case (6):
      h$RTS_81.d1 = h$RTS_82[0];
      h$RTS_81.d2 = { d1: h$RTS_82[1], d2: h$RTS_82[2], d3: h$RTS_82[3], d4: h$RTS_82[4], d5: h$RTS_82[5]
                    };
      return h$RTS_81;
    case (7):
      h$RTS_81.d1 = h$RTS_82[0];
      h$RTS_81.d2 = { d1: h$RTS_82[1], d2: h$RTS_82[2], d3: h$RTS_82[3], d4: h$RTS_82[4], d5: h$RTS_82[5], d6: h$RTS_82[6]
                    };
      return h$RTS_81;
    default:
      h$RTS_81.d1 = h$RTS_82[0];
      h$RTS_81.d2 = { d1: h$RTS_82[1], d2: h$RTS_82[2], d3: h$RTS_82[3], d4: h$RTS_82[4], d5: h$RTS_82[5], d6: h$RTS_82[6]
                    };
      for(var h$RTS_83 = 7;(h$RTS_83 < h$RTS_82.length);(h$RTS_83++)) {
        h$RTS_81.d2[("d" + h$RTS_83)] = h$RTS_82[h$RTS_83];
      };
      return h$RTS_81;
  };
};
function h$runInitStatic()
{
  if((h$initStatic.length == 0))
  {
    return undefined;
  };
  for(var h$RTS_84 = (h$initStatic.length - 1);(h$RTS_84 >= 0);(h$RTS_84--)) {
    h$initStatic[h$RTS_84]();
  };
  h$initStatic = [];
};
function h$checkStack(h$RTS_85)
{
  if((h$RTS_85.t === (-1)))
  {
    h$stack[h$sp] = h$RTS_85;
  };
  var h$RTS_86 = h$sp;
  while((h$RTS_86 >= 0))
  {
    h$RTS_85 = h$stack[h$RTS_86];
    var h$RTS_87;
    var h$RTS_88;
    if((typeof h$RTS_85 === "function"))
    {
      if((h$RTS_85 === h$ap_gen))
      {
        h$RTS_87 = ((h$stack[(h$RTS_86 - 1)] >> 8) + 2);
        h$RTS_88 = 2;
      }
      else
      {
        var h$RTS_89 = h$stack[h$RTS_86].size;
        if((h$RTS_89 <= 0))
        {
          h$RTS_87 = h$stack[(h$RTS_86 - 1)];
          h$RTS_88 = 2;
        }
        else
        {
          h$RTS_87 = ((h$RTS_89 & 255) + 1);
          h$RTS_88 = 1;
        };
      };
      h$RTS_86 -= h$RTS_87;
    }
    else
    {
      h$dumpStackTop(h$stack, 0, h$sp);
      throw(("invalid stack object at: " + h$RTS_86));
    };
  };
};
function h$printReg(h$RTS_90)
{
  if((h$RTS_90 === null))
  {
    return "null";
  }
  else
  {
    if(((((typeof h$RTS_90 === "object") && h$RTS_90.hasOwnProperty("f")) && h$RTS_90.hasOwnProperty("d1")) && h$RTS_90.
    hasOwnProperty("d2")))
    {
      if((typeof h$RTS_90.f !== "function"))
      {
        return "dodgy object";
      }
      else
      {
        if(((h$RTS_90.f.t === 5) && h$RTS_90.x))
        {
          return (("blackhole: -> " + h$printReg({ d: h$RTS_90.d1.x2, f: h$RTS_90.x.x1
                                                 })) + ")");
        }
        else
        {
          var h$RTS_91 = "";
          if(((h$RTS_90.f.n === "integer-gmp:GHC.Integer.Type.Jp#") || (h$RTS_90.f.n === "integer-gmp:GHC.Integer.Type.Jn#")))
          {
            h$RTS_91 = ((((" [" + h$RTS_90.d1.join(",")) + "](") + h$ghcjsbn_showBase(h$RTS_90.d1, 10)) + ")");
          }
          else
          {
            if((h$RTS_90.f.n === "integer-gmp:GHC.Integer.Type.S#"))
            {
              h$RTS_91 = ((" (S: " + h$RTS_90.d1) + ")");
            };
          };
          return ((((((((h$RTS_90.alloc ? (h$RTS_90.alloc + ": ") : "") + h$RTS_90.f.n) + " (") + h$closureTypeName(h$RTS_90.f.
          t)) + ", ") + h$RTS_90.f.a) + ")") + h$RTS_91);
        };
      };
    }
    else
    {
      if((typeof h$RTS_90 === "object"))
      {
        var h$RTS_92 = h$collectProps(h$RTS_90);
        if((h$RTS_92.length > 40))
        {
          return (h$RTS_92.substr(0, 40) + "...");
        }
        else
        {
          return h$RTS_92;
        };
      }
      else
      {
        var h$RTS_93 = (new String(h$RTS_90) + "");
        if((h$RTS_93.length > 40))
        {
          return (h$RTS_93.substr(0, 40) + "...");
        }
        else
        {
          return h$RTS_93;
        };
      };
    };
  };
};
function h$logStack()
{
  if((typeof h$stack[h$sp] === "undefined"))
  {
    h$log("warning: invalid stack frame");
    return undefined;
  };
  var h$RTS_94 = 0;
  var h$RTS_95 = h$stack[h$sp].size;
  if((h$RTS_95 === (-1)))
  {
    h$RTS_94 = (h$stack[(h$sp - 1)] & 255);
  }
  else
  {
    h$RTS_94 = (h$RTS_95 & 255);
  };
  h$dumpStackTop(h$stack, ((h$sp - h$RTS_94) - 2), h$sp);
  for(var h$RTS_96 = Math.max(0, ((h$sp - h$RTS_94) + 1));(h$RTS_96 <= h$sp);(h$RTS_96++)) {
    if((typeof h$stack[h$RTS_96] === "undefined"))
    {
      throw("undefined on stack");
    };
  };
};
function h$ap_1_0()
{
  var h$RTS_97 = h$r1.f;
  switch (h$RTS_97.t)
  {
    case (0):
      return h$RTS_97;
    case (1):
      var h$RTS_99 = h$RTS_97.a;
      var h$RTS_100 = (h$RTS_99 & 255);
      if((1 === h$RTS_100))
      {
        --h$sp;
        return h$RTS_97;
      }
      else
      {
        if((1 > h$RTS_100))
        {
          var h$RTS_101 = (h$RTS_99 >> 8);
          switch (h$RTS_101)
          {
            default:
          };
          h$sp -= h$RTS_101;
          var h$RTS_102 = h$apply[((1 - h$RTS_100) | ((0 - h$RTS_101) << 8))];
          h$stack[h$sp] = h$RTS_102;
          return h$RTS_97;
        }
        else
        {
          var h$RTS_98 = h$c3(h$pap_0, h$r1, ((((h$r1.f.t === 1) ? h$r1.f.a : h$r1.d2.d1) - 0) - 1), null);
          --h$sp;
          h$r1 = h$RTS_98;
          return h$rs();
        };
      };
    case (3):
      var h$RTS_104 = h$r1.d2.d1;
      var h$RTS_105 = (h$RTS_104 & 255);
      if((1 === h$RTS_105))
      {
        --h$sp;
        return h$RTS_97;
      }
      else
      {
        if((1 > h$RTS_105))
        {
          var h$RTS_106 = (h$RTS_104 >> 8);
          switch (h$RTS_106)
          {
            default:
          };
          h$sp -= h$RTS_106;
          var h$RTS_107 = h$apply[((1 - h$RTS_105) | ((0 - h$RTS_106) << 8))];
          h$stack[h$sp] = h$RTS_107;
          return h$RTS_97;
        }
        else
        {
          var h$RTS_103 = h$c3(h$pap_0, h$r1, ((((h$r1.f.t === 1) ? h$r1.f.a : h$r1.d2.d1) - 0) - 1), null);
          --h$sp;
          h$r1 = h$RTS_103;
          return h$rs();
        };
      };
    case (5):
      h$p2(h$r1, h$return);
      return h$blockOnBlackhole(h$r1);
    default:
      throw(("panic: h$ap_1_0, unexpected closure type: " + h$RTS_97.t));
  };
};
h$o(h$ap_1_0, (-1), 0, 0, 256, null);
function h$ap_1_1()
{
  var h$RTS_108 = h$r1.f;
  switch (h$RTS_108.t)
  {
    case (0):
      return h$RTS_108;
    case (1):
      var h$RTS_110 = h$RTS_108.a;
      var h$RTS_111 = (h$RTS_110 & 255);
      if((1 === h$RTS_111))
      {
        h$r2 = h$stack[(h$sp - 1)];
        h$sp -= 2;
        return h$RTS_108;
      }
      else
      {
        if((1 > h$RTS_111))
        {
          var h$RTS_112 = (h$RTS_110 >> 8);
          switch (h$RTS_112)
          {
            case (1):
              h$r2 = h$stack[(h$sp - 1)];
            default:
          };
          h$sp -= h$RTS_112;
          var h$RTS_113 = h$apply[((1 - h$RTS_111) | ((1 - h$RTS_112) << 8))];
          h$stack[h$sp] = h$RTS_113;
          return h$RTS_108;
        }
        else
        {
          var h$RTS_109 = h$c3(h$pap_1, h$r1, ((((h$r1.f.t === 1) ? h$r1.f.a : h$r1.d2.d1) - 256) - 1), h$stack[(h$sp - 1)]);
          h$sp -= 2;
          h$r1 = h$RTS_109;
          return h$rs();
        };
      };
    case (3):
      var h$RTS_115 = h$r1.d2.d1;
      var h$RTS_116 = (h$RTS_115 & 255);
      if((1 === h$RTS_116))
      {
        h$r2 = h$stack[(h$sp - 1)];
        h$sp -= 2;
        return h$RTS_108;
      }
      else
      {
        if((1 > h$RTS_116))
        {
          var h$RTS_117 = (h$RTS_115 >> 8);
          switch (h$RTS_117)
          {
            case (1):
              h$r2 = h$stack[(h$sp - 1)];
            default:
          };
          h$sp -= h$RTS_117;
          var h$RTS_118 = h$apply[((1 - h$RTS_116) | ((1 - h$RTS_117) << 8))];
          h$stack[h$sp] = h$RTS_118;
          return h$RTS_108;
        }
        else
        {
          var h$RTS_114 = h$c3(h$pap_1, h$r1, ((((h$r1.f.t === 1) ? h$r1.f.a : h$r1.d2.d1) - 256) - 1), h$stack[(h$sp - 1)]);
          h$sp -= 2;
          h$r1 = h$RTS_114;
          return h$rs();
        };
      };
    case (5):
      h$p2(h$r1, h$return);
      return h$blockOnBlackhole(h$r1);
    default:
      throw(("panic: h$ap_1_1, unexpected closure type: " + h$RTS_108.t));
  };
};
h$o(h$ap_1_1, (-1), 0, 1, 256, null);
function h$ap_1_2()
{
  var h$RTS_119 = h$r1.f;
  switch (h$RTS_119.t)
  {
    case (0):
      return h$RTS_119;
    case (1):
      var h$RTS_121 = h$RTS_119.a;
      var h$RTS_122 = (h$RTS_121 & 255);
      if((1 === h$RTS_122))
      {
        h$r3 = h$stack[(h$sp - 2)];
        h$r2 = h$stack[(h$sp - 1)];
        h$sp -= 3;
        return h$RTS_119;
      }
      else
      {
        if((1 > h$RTS_122))
        {
          var h$RTS_123 = (h$RTS_121 >> 8);
          switch (h$RTS_123)
          {
            case (2):
              h$r3 = h$stack[(h$sp - 2)];
            case (1):
              h$r2 = h$stack[(h$sp - 1)];
            default:
          };
          h$sp -= h$RTS_123;
          var h$RTS_124 = h$apply[((1 - h$RTS_122) | ((2 - h$RTS_123) << 8))];
          h$stack[h$sp] = h$RTS_124;
          return h$RTS_119;
        }
        else
        {
          var h$RTS_120 = h$c4(h$pap_2, h$r1, ((((h$r1.f.t === 1) ? h$r1.f.a : h$r1.d2.d1) - 512) - 1), h$stack[(h$sp - 1)],
          h$stack[(h$sp - 2)]);
          h$sp -= 3;
          h$r1 = h$RTS_120;
          return h$rs();
        };
      };
    case (3):
      var h$RTS_126 = h$r1.d2.d1;
      var h$RTS_127 = (h$RTS_126 & 255);
      if((1 === h$RTS_127))
      {
        h$r3 = h$stack[(h$sp - 2)];
        h$r2 = h$stack[(h$sp - 1)];
        h$sp -= 3;
        return h$RTS_119;
      }
      else
      {
        if((1 > h$RTS_127))
        {
          var h$RTS_128 = (h$RTS_126 >> 8);
          switch (h$RTS_128)
          {
            case (2):
              h$r3 = h$stack[(h$sp - 2)];
            case (1):
              h$r2 = h$stack[(h$sp - 1)];
            default:
          };
          h$sp -= h$RTS_128;
          var h$RTS_129 = h$apply[((1 - h$RTS_127) | ((2 - h$RTS_128) << 8))];
          h$stack[h$sp] = h$RTS_129;
          return h$RTS_119;
        }
        else
        {
          var h$RTS_125 = h$c4(h$pap_2, h$r1, ((((h$r1.f.t === 1) ? h$r1.f.a : h$r1.d2.d1) - 512) - 1), h$stack[(h$sp - 1)],
          h$stack[(h$sp - 2)]);
          h$sp -= 3;
          h$r1 = h$RTS_125;
          return h$rs();
        };
      };
    case (5):
      h$p2(h$r1, h$return);
      return h$blockOnBlackhole(h$r1);
    default:
      throw(("panic: h$ap_1_2, unexpected closure type: " + h$RTS_119.t));
  };
};
h$o(h$ap_1_2, (-1), 0, 2, 256, null);
function h$ap_2_1()
{
  var h$RTS_130 = h$r1.f;
  switch (h$RTS_130.t)
  {
    case (0):
      return h$RTS_130;
    case (1):
      var h$RTS_132 = h$RTS_130.a;
      var h$RTS_133 = (h$RTS_132 & 255);
      if((2 === h$RTS_133))
      {
        h$r2 = h$stack[(h$sp - 1)];
        h$sp -= 2;
        return h$RTS_130;
      }
      else
      {
        if((2 > h$RTS_133))
        {
          var h$RTS_134 = (h$RTS_132 >> 8);
          switch (h$RTS_134)
          {
            case (1):
              h$r2 = h$stack[(h$sp - 1)];
            default:
          };
          h$sp -= h$RTS_134;
          var h$RTS_135 = h$apply[((2 - h$RTS_133) | ((1 - h$RTS_134) << 8))];
          h$stack[h$sp] = h$RTS_135;
          return h$RTS_130;
        }
        else
        {
          var h$RTS_131 = h$c3(h$pap_1, h$r1, ((((h$r1.f.t === 1) ? h$r1.f.a : h$r1.d2.d1) - 256) - 2), h$stack[(h$sp - 1)]);
          h$sp -= 2;
          h$r1 = h$RTS_131;
          return h$rs();
        };
      };
    case (3):
      var h$RTS_137 = h$r1.d2.d1;
      var h$RTS_138 = (h$RTS_137 & 255);
      if((2 === h$RTS_138))
      {
        h$r2 = h$stack[(h$sp - 1)];
        h$sp -= 2;
        return h$RTS_130;
      }
      else
      {
        if((2 > h$RTS_138))
        {
          var h$RTS_139 = (h$RTS_137 >> 8);
          switch (h$RTS_139)
          {
            case (1):
              h$r2 = h$stack[(h$sp - 1)];
            default:
          };
          h$sp -= h$RTS_139;
          var h$RTS_140 = h$apply[((2 - h$RTS_138) | ((1 - h$RTS_139) << 8))];
          h$stack[h$sp] = h$RTS_140;
          return h$RTS_130;
        }
        else
        {
          var h$RTS_136 = h$c3(h$pap_1, h$r1, ((((h$r1.f.t === 1) ? h$r1.f.a : h$r1.d2.d1) - 256) - 2), h$stack[(h$sp - 1)]);
          h$sp -= 2;
          h$r1 = h$RTS_136;
          return h$rs();
        };
      };
    case (5):
      h$p2(h$r1, h$return);
      return h$blockOnBlackhole(h$r1);
    default:
      throw(("panic: h$ap_2_1, unexpected closure type: " + h$RTS_130.t));
  };
};
h$o(h$ap_2_1, (-1), 0, 1, 256, null);
function h$ap_2_2()
{
  var h$RTS_141 = h$r1.f;
  switch (h$RTS_141.t)
  {
    case (0):
      return h$RTS_141;
    case (1):
      var h$RTS_143 = h$RTS_141.a;
      var h$RTS_144 = (h$RTS_143 & 255);
      if((2 === h$RTS_144))
      {
        h$r3 = h$stack[(h$sp - 2)];
        h$r2 = h$stack[(h$sp - 1)];
        h$sp -= 3;
        return h$RTS_141;
      }
      else
      {
        if((2 > h$RTS_144))
        {
          var h$RTS_145 = (h$RTS_143 >> 8);
          switch (h$RTS_145)
          {
            case (2):
              h$r3 = h$stack[(h$sp - 2)];
            case (1):
              h$r2 = h$stack[(h$sp - 1)];
            default:
          };
          h$sp -= h$RTS_145;
          var h$RTS_146 = h$apply[((2 - h$RTS_144) | ((2 - h$RTS_145) << 8))];
          h$stack[h$sp] = h$RTS_146;
          return h$RTS_141;
        }
        else
        {
          var h$RTS_142 = h$c4(h$pap_2, h$r1, ((((h$r1.f.t === 1) ? h$r1.f.a : h$r1.d2.d1) - 512) - 2), h$stack[(h$sp - 1)],
          h$stack[(h$sp - 2)]);
          h$sp -= 3;
          h$r1 = h$RTS_142;
          return h$rs();
        };
      };
    case (3):
      var h$RTS_148 = h$r1.d2.d1;
      var h$RTS_149 = (h$RTS_148 & 255);
      if((2 === h$RTS_149))
      {
        h$r3 = h$stack[(h$sp - 2)];
        h$r2 = h$stack[(h$sp - 1)];
        h$sp -= 3;
        return h$RTS_141;
      }
      else
      {
        if((2 > h$RTS_149))
        {
          var h$RTS_150 = (h$RTS_148 >> 8);
          switch (h$RTS_150)
          {
            case (2):
              h$r3 = h$stack[(h$sp - 2)];
            case (1):
              h$r2 = h$stack[(h$sp - 1)];
            default:
          };
          h$sp -= h$RTS_150;
          var h$RTS_151 = h$apply[((2 - h$RTS_149) | ((2 - h$RTS_150) << 8))];
          h$stack[h$sp] = h$RTS_151;
          return h$RTS_141;
        }
        else
        {
          var h$RTS_147 = h$c4(h$pap_2, h$r1, ((((h$r1.f.t === 1) ? h$r1.f.a : h$r1.d2.d1) - 512) - 2), h$stack[(h$sp - 1)],
          h$stack[(h$sp - 2)]);
          h$sp -= 3;
          h$r1 = h$RTS_147;
          return h$rs();
        };
      };
    case (5):
      h$p2(h$r1, h$return);
      return h$blockOnBlackhole(h$r1);
    default:
      throw(("panic: h$ap_2_2, unexpected closure type: " + h$RTS_141.t));
  };
};
h$o(h$ap_2_2, (-1), 0, 2, 256, null);
function h$ap_2_3()
{
  var h$RTS_152 = h$r1.f;
  switch (h$RTS_152.t)
  {
    case (0):
      return h$RTS_152;
    case (1):
      var h$RTS_154 = h$RTS_152.a;
      var h$RTS_155 = (h$RTS_154 & 255);
      if((2 === h$RTS_155))
      {
        h$r4 = h$stack[(h$sp - 3)];
        h$r3 = h$stack[(h$sp - 2)];
        h$r2 = h$stack[(h$sp - 1)];
        h$sp -= 4;
        return h$RTS_152;
      }
      else
      {
        if((2 > h$RTS_155))
        {
          var h$RTS_156 = (h$RTS_154 >> 8);
          switch (h$RTS_156)
          {
            case (3):
              h$r4 = h$stack[(h$sp - 3)];
            case (2):
              h$r3 = h$stack[(h$sp - 2)];
            case (1):
              h$r2 = h$stack[(h$sp - 1)];
            default:
          };
          h$sp -= h$RTS_156;
          var h$RTS_157 = h$apply[((2 - h$RTS_155) | ((3 - h$RTS_156) << 8))];
          h$stack[h$sp] = h$RTS_157;
          return h$RTS_152;
        }
        else
        {
          var h$RTS_153 = h$c5(h$pap_3, h$r1, ((((h$r1.f.t === 1) ? h$r1.f.a : h$r1.d2.d1) - 768) - 2), h$stack[(h$sp - 1)],
          h$stack[(h$sp - 2)], h$stack[(h$sp - 3)]);
          h$sp -= 4;
          h$r1 = h$RTS_153;
          return h$rs();
        };
      };
    case (3):
      var h$RTS_159 = h$r1.d2.d1;
      var h$RTS_160 = (h$RTS_159 & 255);
      if((2 === h$RTS_160))
      {
        h$r4 = h$stack[(h$sp - 3)];
        h$r3 = h$stack[(h$sp - 2)];
        h$r2 = h$stack[(h$sp - 1)];
        h$sp -= 4;
        return h$RTS_152;
      }
      else
      {
        if((2 > h$RTS_160))
        {
          var h$RTS_161 = (h$RTS_159 >> 8);
          switch (h$RTS_161)
          {
            case (3):
              h$r4 = h$stack[(h$sp - 3)];
            case (2):
              h$r3 = h$stack[(h$sp - 2)];
            case (1):
              h$r2 = h$stack[(h$sp - 1)];
            default:
          };
          h$sp -= h$RTS_161;
          var h$RTS_162 = h$apply[((2 - h$RTS_160) | ((3 - h$RTS_161) << 8))];
          h$stack[h$sp] = h$RTS_162;
          return h$RTS_152;
        }
        else
        {
          var h$RTS_158 = h$c5(h$pap_3, h$r1, ((((h$r1.f.t === 1) ? h$r1.f.a : h$r1.d2.d1) - 768) - 2), h$stack[(h$sp - 1)],
          h$stack[(h$sp - 2)], h$stack[(h$sp - 3)]);
          h$sp -= 4;
          h$r1 = h$RTS_158;
          return h$rs();
        };
      };
    case (5):
      h$p2(h$r1, h$return);
      return h$blockOnBlackhole(h$r1);
    default:
      throw(("panic: h$ap_2_3, unexpected closure type: " + h$RTS_152.t));
  };
};
h$o(h$ap_2_3, (-1), 0, 3, 256, null);
function h$ap_2_4()
{
  var h$RTS_163 = h$r1.f;
  switch (h$RTS_163.t)
  {
    case (0):
      return h$RTS_163;
    case (1):
      var h$RTS_165 = h$RTS_163.a;
      var h$RTS_166 = (h$RTS_165 & 255);
      if((2 === h$RTS_166))
      {
        h$r5 = h$stack[(h$sp - 4)];
        h$r4 = h$stack[(h$sp - 3)];
        h$r3 = h$stack[(h$sp - 2)];
        h$r2 = h$stack[(h$sp - 1)];
        h$sp -= 5;
        return h$RTS_163;
      }
      else
      {
        if((2 > h$RTS_166))
        {
          var h$RTS_167 = (h$RTS_165 >> 8);
          switch (h$RTS_167)
          {
            case (4):
              h$r5 = h$stack[(h$sp - 4)];
            case (3):
              h$r4 = h$stack[(h$sp - 3)];
            case (2):
              h$r3 = h$stack[(h$sp - 2)];
            case (1):
              h$r2 = h$stack[(h$sp - 1)];
            default:
          };
          h$sp -= h$RTS_167;
          var h$RTS_168 = h$apply[((2 - h$RTS_166) | ((4 - h$RTS_167) << 8))];
          h$stack[h$sp] = h$RTS_168;
          return h$RTS_163;
        }
        else
        {
          var h$RTS_164 = h$c6(h$pap_4, h$r1, ((((h$r1.f.t === 1) ? h$r1.f.a : h$r1.d2.d1) - 1024) - 2), h$stack[(h$sp - 1)],
          h$stack[(h$sp - 2)], h$stack[(h$sp - 3)], h$stack[(h$sp - 4)]);
          h$sp -= 5;
          h$r1 = h$RTS_164;
          return h$rs();
        };
      };
    case (3):
      var h$RTS_170 = h$r1.d2.d1;
      var h$RTS_171 = (h$RTS_170 & 255);
      if((2 === h$RTS_171))
      {
        h$r5 = h$stack[(h$sp - 4)];
        h$r4 = h$stack[(h$sp - 3)];
        h$r3 = h$stack[(h$sp - 2)];
        h$r2 = h$stack[(h$sp - 1)];
        h$sp -= 5;
        return h$RTS_163;
      }
      else
      {
        if((2 > h$RTS_171))
        {
          var h$RTS_172 = (h$RTS_170 >> 8);
          switch (h$RTS_172)
          {
            case (4):
              h$r5 = h$stack[(h$sp - 4)];
            case (3):
              h$r4 = h$stack[(h$sp - 3)];
            case (2):
              h$r3 = h$stack[(h$sp - 2)];
            case (1):
              h$r2 = h$stack[(h$sp - 1)];
            default:
          };
          h$sp -= h$RTS_172;
          var h$RTS_173 = h$apply[((2 - h$RTS_171) | ((4 - h$RTS_172) << 8))];
          h$stack[h$sp] = h$RTS_173;
          return h$RTS_163;
        }
        else
        {
          var h$RTS_169 = h$c6(h$pap_4, h$r1, ((((h$r1.f.t === 1) ? h$r1.f.a : h$r1.d2.d1) - 1024) - 2), h$stack[(h$sp - 1)],
          h$stack[(h$sp - 2)], h$stack[(h$sp - 3)], h$stack[(h$sp - 4)]);
          h$sp -= 5;
          h$r1 = h$RTS_169;
          return h$rs();
        };
      };
    case (5):
      h$p2(h$r1, h$return);
      return h$blockOnBlackhole(h$r1);
    default:
      throw(("panic: h$ap_2_4, unexpected closure type: " + h$RTS_163.t));
  };
};
h$o(h$ap_2_4, (-1), 0, 4, 256, null);
function h$ap_3_2()
{
  var h$RTS_174 = h$r1.f;
  switch (h$RTS_174.t)
  {
    case (0):
      return h$RTS_174;
    case (1):
      var h$RTS_176 = h$RTS_174.a;
      var h$RTS_177 = (h$RTS_176 & 255);
      if((3 === h$RTS_177))
      {
        h$r3 = h$stack[(h$sp - 2)];
        h$r2 = h$stack[(h$sp - 1)];
        h$sp -= 3;
        return h$RTS_174;
      }
      else
      {
        if((3 > h$RTS_177))
        {
          var h$RTS_178 = (h$RTS_176 >> 8);
          switch (h$RTS_178)
          {
            case (2):
              h$r3 = h$stack[(h$sp - 2)];
            case (1):
              h$r2 = h$stack[(h$sp - 1)];
            default:
          };
          h$sp -= h$RTS_178;
          var h$RTS_179 = h$apply[((3 - h$RTS_177) | ((2 - h$RTS_178) << 8))];
          h$stack[h$sp] = h$RTS_179;
          return h$RTS_174;
        }
        else
        {
          var h$RTS_175 = h$c4(h$pap_2, h$r1, ((((h$r1.f.t === 1) ? h$r1.f.a : h$r1.d2.d1) - 512) - 3), h$stack[(h$sp - 1)],
          h$stack[(h$sp - 2)]);
          h$sp -= 3;
          h$r1 = h$RTS_175;
          return h$rs();
        };
      };
    case (3):
      var h$RTS_181 = h$r1.d2.d1;
      var h$RTS_182 = (h$RTS_181 & 255);
      if((3 === h$RTS_182))
      {
        h$r3 = h$stack[(h$sp - 2)];
        h$r2 = h$stack[(h$sp - 1)];
        h$sp -= 3;
        return h$RTS_174;
      }
      else
      {
        if((3 > h$RTS_182))
        {
          var h$RTS_183 = (h$RTS_181 >> 8);
          switch (h$RTS_183)
          {
            case (2):
              h$r3 = h$stack[(h$sp - 2)];
            case (1):
              h$r2 = h$stack[(h$sp - 1)];
            default:
          };
          h$sp -= h$RTS_183;
          var h$RTS_184 = h$apply[((3 - h$RTS_182) | ((2 - h$RTS_183) << 8))];
          h$stack[h$sp] = h$RTS_184;
          return h$RTS_174;
        }
        else
        {
          var h$RTS_180 = h$c4(h$pap_2, h$r1, ((((h$r1.f.t === 1) ? h$r1.f.a : h$r1.d2.d1) - 512) - 3), h$stack[(h$sp - 1)],
          h$stack[(h$sp - 2)]);
          h$sp -= 3;
          h$r1 = h$RTS_180;
          return h$rs();
        };
      };
    case (5):
      h$p2(h$r1, h$return);
      return h$blockOnBlackhole(h$r1);
    default:
      throw(("panic: h$ap_3_2, unexpected closure type: " + h$RTS_174.t));
  };
};
h$o(h$ap_3_2, (-1), 0, 2, 256, null);
function h$ap_3_3()
{
  var h$RTS_185 = h$r1.f;
  switch (h$RTS_185.t)
  {
    case (0):
      return h$RTS_185;
    case (1):
      var h$RTS_187 = h$RTS_185.a;
      var h$RTS_188 = (h$RTS_187 & 255);
      if((3 === h$RTS_188))
      {
        h$r4 = h$stack[(h$sp - 3)];
        h$r3 = h$stack[(h$sp - 2)];
        h$r2 = h$stack[(h$sp - 1)];
        h$sp -= 4;
        return h$RTS_185;
      }
      else
      {
        if((3 > h$RTS_188))
        {
          var h$RTS_189 = (h$RTS_187 >> 8);
          switch (h$RTS_189)
          {
            case (3):
              h$r4 = h$stack[(h$sp - 3)];
            case (2):
              h$r3 = h$stack[(h$sp - 2)];
            case (1):
              h$r2 = h$stack[(h$sp - 1)];
            default:
          };
          h$sp -= h$RTS_189;
          var h$RTS_190 = h$apply[((3 - h$RTS_188) | ((3 - h$RTS_189) << 8))];
          h$stack[h$sp] = h$RTS_190;
          return h$RTS_185;
        }
        else
        {
          var h$RTS_186 = h$c5(h$pap_3, h$r1, ((((h$r1.f.t === 1) ? h$r1.f.a : h$r1.d2.d1) - 768) - 3), h$stack[(h$sp - 1)],
          h$stack[(h$sp - 2)], h$stack[(h$sp - 3)]);
          h$sp -= 4;
          h$r1 = h$RTS_186;
          return h$rs();
        };
      };
    case (3):
      var h$RTS_192 = h$r1.d2.d1;
      var h$RTS_193 = (h$RTS_192 & 255);
      if((3 === h$RTS_193))
      {
        h$r4 = h$stack[(h$sp - 3)];
        h$r3 = h$stack[(h$sp - 2)];
        h$r2 = h$stack[(h$sp - 1)];
        h$sp -= 4;
        return h$RTS_185;
      }
      else
      {
        if((3 > h$RTS_193))
        {
          var h$RTS_194 = (h$RTS_192 >> 8);
          switch (h$RTS_194)
          {
            case (3):
              h$r4 = h$stack[(h$sp - 3)];
            case (2):
              h$r3 = h$stack[(h$sp - 2)];
            case (1):
              h$r2 = h$stack[(h$sp - 1)];
            default:
          };
          h$sp -= h$RTS_194;
          var h$RTS_195 = h$apply[((3 - h$RTS_193) | ((3 - h$RTS_194) << 8))];
          h$stack[h$sp] = h$RTS_195;
          return h$RTS_185;
        }
        else
        {
          var h$RTS_191 = h$c5(h$pap_3, h$r1, ((((h$r1.f.t === 1) ? h$r1.f.a : h$r1.d2.d1) - 768) - 3), h$stack[(h$sp - 1)],
          h$stack[(h$sp - 2)], h$stack[(h$sp - 3)]);
          h$sp -= 4;
          h$r1 = h$RTS_191;
          return h$rs();
        };
      };
    case (5):
      h$p2(h$r1, h$return);
      return h$blockOnBlackhole(h$r1);
    default:
      throw(("panic: h$ap_3_3, unexpected closure type: " + h$RTS_185.t));
  };
};
h$o(h$ap_3_3, (-1), 0, 3, 256, null);
function h$ap_3_4()
{
  var h$RTS_196 = h$r1.f;
  switch (h$RTS_196.t)
  {
    case (0):
      return h$RTS_196;
    case (1):
      var h$RTS_198 = h$RTS_196.a;
      var h$RTS_199 = (h$RTS_198 & 255);
      if((3 === h$RTS_199))
      {
        h$r5 = h$stack[(h$sp - 4)];
        h$r4 = h$stack[(h$sp - 3)];
        h$r3 = h$stack[(h$sp - 2)];
        h$r2 = h$stack[(h$sp - 1)];
        h$sp -= 5;
        return h$RTS_196;
      }
      else
      {
        if((3 > h$RTS_199))
        {
          var h$RTS_200 = (h$RTS_198 >> 8);
          switch (h$RTS_200)
          {
            case (4):
              h$r5 = h$stack[(h$sp - 4)];
            case (3):
              h$r4 = h$stack[(h$sp - 3)];
            case (2):
              h$r3 = h$stack[(h$sp - 2)];
            case (1):
              h$r2 = h$stack[(h$sp - 1)];
            default:
          };
          h$sp -= h$RTS_200;
          var h$RTS_201 = h$apply[((3 - h$RTS_199) | ((4 - h$RTS_200) << 8))];
          h$stack[h$sp] = h$RTS_201;
          return h$RTS_196;
        }
        else
        {
          var h$RTS_197 = h$c6(h$pap_4, h$r1, ((((h$r1.f.t === 1) ? h$r1.f.a : h$r1.d2.d1) - 1024) - 3), h$stack[(h$sp - 1)],
          h$stack[(h$sp - 2)], h$stack[(h$sp - 3)], h$stack[(h$sp - 4)]);
          h$sp -= 5;
          h$r1 = h$RTS_197;
          return h$rs();
        };
      };
    case (3):
      var h$RTS_203 = h$r1.d2.d1;
      var h$RTS_204 = (h$RTS_203 & 255);
      if((3 === h$RTS_204))
      {
        h$r5 = h$stack[(h$sp - 4)];
        h$r4 = h$stack[(h$sp - 3)];
        h$r3 = h$stack[(h$sp - 2)];
        h$r2 = h$stack[(h$sp - 1)];
        h$sp -= 5;
        return h$RTS_196;
      }
      else
      {
        if((3 > h$RTS_204))
        {
          var h$RTS_205 = (h$RTS_203 >> 8);
          switch (h$RTS_205)
          {
            case (4):
              h$r5 = h$stack[(h$sp - 4)];
            case (3):
              h$r4 = h$stack[(h$sp - 3)];
            case (2):
              h$r3 = h$stack[(h$sp - 2)];
            case (1):
              h$r2 = h$stack[(h$sp - 1)];
            default:
          };
          h$sp -= h$RTS_205;
          var h$RTS_206 = h$apply[((3 - h$RTS_204) | ((4 - h$RTS_205) << 8))];
          h$stack[h$sp] = h$RTS_206;
          return h$RTS_196;
        }
        else
        {
          var h$RTS_202 = h$c6(h$pap_4, h$r1, ((((h$r1.f.t === 1) ? h$r1.f.a : h$r1.d2.d1) - 1024) - 3), h$stack[(h$sp - 1)],
          h$stack[(h$sp - 2)], h$stack[(h$sp - 3)], h$stack[(h$sp - 4)]);
          h$sp -= 5;
          h$r1 = h$RTS_202;
          return h$rs();
        };
      };
    case (5):
      h$p2(h$r1, h$return);
      return h$blockOnBlackhole(h$r1);
    default:
      throw(("panic: h$ap_3_4, unexpected closure type: " + h$RTS_196.t));
  };
};
h$o(h$ap_3_4, (-1), 0, 4, 256, null);
function h$ap_3_5()
{
  var h$RTS_207 = h$r1.f;
  switch (h$RTS_207.t)
  {
    case (0):
      return h$RTS_207;
    case (1):
      var h$RTS_209 = h$RTS_207.a;
      var h$RTS_210 = (h$RTS_209 & 255);
      if((3 === h$RTS_210))
      {
        h$r6 = h$stack[(h$sp - 5)];
        h$r5 = h$stack[(h$sp - 4)];
        h$r4 = h$stack[(h$sp - 3)];
        h$r3 = h$stack[(h$sp - 2)];
        h$r2 = h$stack[(h$sp - 1)];
        h$sp -= 6;
        return h$RTS_207;
      }
      else
      {
        if((3 > h$RTS_210))
        {
          var h$RTS_211 = (h$RTS_209 >> 8);
          switch (h$RTS_211)
          {
            case (5):
              h$r6 = h$stack[(h$sp - 5)];
            case (4):
              h$r5 = h$stack[(h$sp - 4)];
            case (3):
              h$r4 = h$stack[(h$sp - 3)];
            case (2):
              h$r3 = h$stack[(h$sp - 2)];
            case (1):
              h$r2 = h$stack[(h$sp - 1)];
            default:
          };
          h$sp -= h$RTS_211;
          var h$RTS_212 = h$apply[((3 - h$RTS_210) | ((5 - h$RTS_211) << 8))];
          h$stack[h$sp] = h$RTS_212;
          return h$RTS_207;
        }
        else
        {
          var h$RTS_208 = h$c7(h$pap_5, h$r1, ((((h$r1.f.t === 1) ? h$r1.f.a : h$r1.d2.d1) - 1280) - 3), h$stack[(h$sp - 1)],
          h$stack[(h$sp - 2)], h$stack[(h$sp - 3)], h$stack[(h$sp - 4)], h$stack[(h$sp - 5)]);
          h$sp -= 6;
          h$r1 = h$RTS_208;
          return h$rs();
        };
      };
    case (3):
      var h$RTS_214 = h$r1.d2.d1;
      var h$RTS_215 = (h$RTS_214 & 255);
      if((3 === h$RTS_215))
      {
        h$r6 = h$stack[(h$sp - 5)];
        h$r5 = h$stack[(h$sp - 4)];
        h$r4 = h$stack[(h$sp - 3)];
        h$r3 = h$stack[(h$sp - 2)];
        h$r2 = h$stack[(h$sp - 1)];
        h$sp -= 6;
        return h$RTS_207;
      }
      else
      {
        if((3 > h$RTS_215))
        {
          var h$RTS_216 = (h$RTS_214 >> 8);
          switch (h$RTS_216)
          {
            case (5):
              h$r6 = h$stack[(h$sp - 5)];
            case (4):
              h$r5 = h$stack[(h$sp - 4)];
            case (3):
              h$r4 = h$stack[(h$sp - 3)];
            case (2):
              h$r3 = h$stack[(h$sp - 2)];
            case (1):
              h$r2 = h$stack[(h$sp - 1)];
            default:
          };
          h$sp -= h$RTS_216;
          var h$RTS_217 = h$apply[((3 - h$RTS_215) | ((5 - h$RTS_216) << 8))];
          h$stack[h$sp] = h$RTS_217;
          return h$RTS_207;
        }
        else
        {
          var h$RTS_213 = h$c7(h$pap_5, h$r1, ((((h$r1.f.t === 1) ? h$r1.f.a : h$r1.d2.d1) - 1280) - 3), h$stack[(h$sp - 1)],
          h$stack[(h$sp - 2)], h$stack[(h$sp - 3)], h$stack[(h$sp - 4)], h$stack[(h$sp - 5)]);
          h$sp -= 6;
          h$r1 = h$RTS_213;
          return h$rs();
        };
      };
    case (5):
      h$p2(h$r1, h$return);
      return h$blockOnBlackhole(h$r1);
    default:
      throw(("panic: h$ap_3_5, unexpected closure type: " + h$RTS_207.t));
  };
};
h$o(h$ap_3_5, (-1), 0, 5, 256, null);
function h$ap_3_6()
{
  var h$RTS_218 = h$r1.f;
  switch (h$RTS_218.t)
  {
    case (0):
      return h$RTS_218;
    case (1):
      var h$RTS_220 = h$RTS_218.a;
      var h$RTS_221 = (h$RTS_220 & 255);
      if((3 === h$RTS_221))
      {
        h$r7 = h$stack[(h$sp - 6)];
        h$r6 = h$stack[(h$sp - 5)];
        h$r5 = h$stack[(h$sp - 4)];
        h$r4 = h$stack[(h$sp - 3)];
        h$r3 = h$stack[(h$sp - 2)];
        h$r2 = h$stack[(h$sp - 1)];
        h$sp -= 7;
        return h$RTS_218;
      }
      else
      {
        if((3 > h$RTS_221))
        {
          var h$RTS_222 = (h$RTS_220 >> 8);
          switch (h$RTS_222)
          {
            case (6):
              h$r7 = h$stack[(h$sp - 6)];
            case (5):
              h$r6 = h$stack[(h$sp - 5)];
            case (4):
              h$r5 = h$stack[(h$sp - 4)];
            case (3):
              h$r4 = h$stack[(h$sp - 3)];
            case (2):
              h$r3 = h$stack[(h$sp - 2)];
            case (1):
              h$r2 = h$stack[(h$sp - 1)];
            default:
          };
          h$sp -= h$RTS_222;
          var h$RTS_223 = h$apply[((3 - h$RTS_221) | ((6 - h$RTS_222) << 8))];
          h$stack[h$sp] = h$RTS_223;
          return h$RTS_218;
        }
        else
        {
          var h$RTS_219 = h$c8(h$pap_6, h$r1, ((((h$r1.f.t === 1) ? h$r1.f.a : h$r1.d2.d1) - 1536) - 3), h$stack[(h$sp - 1)],
          h$stack[(h$sp - 2)], h$stack[(h$sp - 3)], h$stack[(h$sp - 4)], h$stack[(h$sp - 5)], h$stack[(h$sp - 6)]);
          h$sp -= 7;
          h$r1 = h$RTS_219;
          return h$rs();
        };
      };
    case (3):
      var h$RTS_225 = h$r1.d2.d1;
      var h$RTS_226 = (h$RTS_225 & 255);
      if((3 === h$RTS_226))
      {
        h$r7 = h$stack[(h$sp - 6)];
        h$r6 = h$stack[(h$sp - 5)];
        h$r5 = h$stack[(h$sp - 4)];
        h$r4 = h$stack[(h$sp - 3)];
        h$r3 = h$stack[(h$sp - 2)];
        h$r2 = h$stack[(h$sp - 1)];
        h$sp -= 7;
        return h$RTS_218;
      }
      else
      {
        if((3 > h$RTS_226))
        {
          var h$RTS_227 = (h$RTS_225 >> 8);
          switch (h$RTS_227)
          {
            case (6):
              h$r7 = h$stack[(h$sp - 6)];
            case (5):
              h$r6 = h$stack[(h$sp - 5)];
            case (4):
              h$r5 = h$stack[(h$sp - 4)];
            case (3):
              h$r4 = h$stack[(h$sp - 3)];
            case (2):
              h$r3 = h$stack[(h$sp - 2)];
            case (1):
              h$r2 = h$stack[(h$sp - 1)];
            default:
          };
          h$sp -= h$RTS_227;
          var h$RTS_228 = h$apply[((3 - h$RTS_226) | ((6 - h$RTS_227) << 8))];
          h$stack[h$sp] = h$RTS_228;
          return h$RTS_218;
        }
        else
        {
          var h$RTS_224 = h$c8(h$pap_6, h$r1, ((((h$r1.f.t === 1) ? h$r1.f.a : h$r1.d2.d1) - 1536) - 3), h$stack[(h$sp - 1)],
          h$stack[(h$sp - 2)], h$stack[(h$sp - 3)], h$stack[(h$sp - 4)], h$stack[(h$sp - 5)], h$stack[(h$sp - 6)]);
          h$sp -= 7;
          h$r1 = h$RTS_224;
          return h$rs();
        };
      };
    case (5):
      h$p2(h$r1, h$return);
      return h$blockOnBlackhole(h$r1);
    default:
      throw(("panic: h$ap_3_6, unexpected closure type: " + h$RTS_218.t));
  };
};
h$o(h$ap_3_6, (-1), 0, 6, 256, null);
function h$ap_4_3()
{
  var h$RTS_229 = h$r1.f;
  switch (h$RTS_229.t)
  {
    case (0):
      return h$RTS_229;
    case (1):
      var h$RTS_231 = h$RTS_229.a;
      var h$RTS_232 = (h$RTS_231 & 255);
      if((4 === h$RTS_232))
      {
        h$r4 = h$stack[(h$sp - 3)];
        h$r3 = h$stack[(h$sp - 2)];
        h$r2 = h$stack[(h$sp - 1)];
        h$sp -= 4;
        return h$RTS_229;
      }
      else
      {
        if((4 > h$RTS_232))
        {
          var h$RTS_233 = (h$RTS_231 >> 8);
          switch (h$RTS_233)
          {
            case (3):
              h$r4 = h$stack[(h$sp - 3)];
            case (2):
              h$r3 = h$stack[(h$sp - 2)];
            case (1):
              h$r2 = h$stack[(h$sp - 1)];
            default:
          };
          h$sp -= h$RTS_233;
          var h$RTS_234 = h$apply[((4 - h$RTS_232) | ((3 - h$RTS_233) << 8))];
          h$stack[h$sp] = h$RTS_234;
          return h$RTS_229;
        }
        else
        {
          var h$RTS_230 = h$c5(h$pap_3, h$r1, ((((h$r1.f.t === 1) ? h$r1.f.a : h$r1.d2.d1) - 768) - 4), h$stack[(h$sp - 1)],
          h$stack[(h$sp - 2)], h$stack[(h$sp - 3)]);
          h$sp -= 4;
          h$r1 = h$RTS_230;
          return h$rs();
        };
      };
    case (3):
      var h$RTS_236 = h$r1.d2.d1;
      var h$RTS_237 = (h$RTS_236 & 255);
      if((4 === h$RTS_237))
      {
        h$r4 = h$stack[(h$sp - 3)];
        h$r3 = h$stack[(h$sp - 2)];
        h$r2 = h$stack[(h$sp - 1)];
        h$sp -= 4;
        return h$RTS_229;
      }
      else
      {
        if((4 > h$RTS_237))
        {
          var h$RTS_238 = (h$RTS_236 >> 8);
          switch (h$RTS_238)
          {
            case (3):
              h$r4 = h$stack[(h$sp - 3)];
            case (2):
              h$r3 = h$stack[(h$sp - 2)];
            case (1):
              h$r2 = h$stack[(h$sp - 1)];
            default:
          };
          h$sp -= h$RTS_238;
          var h$RTS_239 = h$apply[((4 - h$RTS_237) | ((3 - h$RTS_238) << 8))];
          h$stack[h$sp] = h$RTS_239;
          return h$RTS_229;
        }
        else
        {
          var h$RTS_235 = h$c5(h$pap_3, h$r1, ((((h$r1.f.t === 1) ? h$r1.f.a : h$r1.d2.d1) - 768) - 4), h$stack[(h$sp - 1)],
          h$stack[(h$sp - 2)], h$stack[(h$sp - 3)]);
          h$sp -= 4;
          h$r1 = h$RTS_235;
          return h$rs();
        };
      };
    case (5):
      h$p2(h$r1, h$return);
      return h$blockOnBlackhole(h$r1);
    default:
      throw(("panic: h$ap_4_3, unexpected closure type: " + h$RTS_229.t));
  };
};
h$o(h$ap_4_3, (-1), 0, 3, 256, null);
function h$ap_4_4()
{
  var h$RTS_240 = h$r1.f;
  switch (h$RTS_240.t)
  {
    case (0):
      return h$RTS_240;
    case (1):
      var h$RTS_242 = h$RTS_240.a;
      var h$RTS_243 = (h$RTS_242 & 255);
      if((4 === h$RTS_243))
      {
        h$r5 = h$stack[(h$sp - 4)];
        h$r4 = h$stack[(h$sp - 3)];
        h$r3 = h$stack[(h$sp - 2)];
        h$r2 = h$stack[(h$sp - 1)];
        h$sp -= 5;
        return h$RTS_240;
      }
      else
      {
        if((4 > h$RTS_243))
        {
          var h$RTS_244 = (h$RTS_242 >> 8);
          switch (h$RTS_244)
          {
            case (4):
              h$r5 = h$stack[(h$sp - 4)];
            case (3):
              h$r4 = h$stack[(h$sp - 3)];
            case (2):
              h$r3 = h$stack[(h$sp - 2)];
            case (1):
              h$r2 = h$stack[(h$sp - 1)];
            default:
          };
          h$sp -= h$RTS_244;
          var h$RTS_245 = h$apply[((4 - h$RTS_243) | ((4 - h$RTS_244) << 8))];
          h$stack[h$sp] = h$RTS_245;
          return h$RTS_240;
        }
        else
        {
          var h$RTS_241 = h$c6(h$pap_4, h$r1, ((((h$r1.f.t === 1) ? h$r1.f.a : h$r1.d2.d1) - 1024) - 4), h$stack[(h$sp - 1)],
          h$stack[(h$sp - 2)], h$stack[(h$sp - 3)], h$stack[(h$sp - 4)]);
          h$sp -= 5;
          h$r1 = h$RTS_241;
          return h$rs();
        };
      };
    case (3):
      var h$RTS_247 = h$r1.d2.d1;
      var h$RTS_248 = (h$RTS_247 & 255);
      if((4 === h$RTS_248))
      {
        h$r5 = h$stack[(h$sp - 4)];
        h$r4 = h$stack[(h$sp - 3)];
        h$r3 = h$stack[(h$sp - 2)];
        h$r2 = h$stack[(h$sp - 1)];
        h$sp -= 5;
        return h$RTS_240;
      }
      else
      {
        if((4 > h$RTS_248))
        {
          var h$RTS_249 = (h$RTS_247 >> 8);
          switch (h$RTS_249)
          {
            case (4):
              h$r5 = h$stack[(h$sp - 4)];
            case (3):
              h$r4 = h$stack[(h$sp - 3)];
            case (2):
              h$r3 = h$stack[(h$sp - 2)];
            case (1):
              h$r2 = h$stack[(h$sp - 1)];
            default:
          };
          h$sp -= h$RTS_249;
          var h$RTS_250 = h$apply[((4 - h$RTS_248) | ((4 - h$RTS_249) << 8))];
          h$stack[h$sp] = h$RTS_250;
          return h$RTS_240;
        }
        else
        {
          var h$RTS_246 = h$c6(h$pap_4, h$r1, ((((h$r1.f.t === 1) ? h$r1.f.a : h$r1.d2.d1) - 1024) - 4), h$stack[(h$sp - 1)],
          h$stack[(h$sp - 2)], h$stack[(h$sp - 3)], h$stack[(h$sp - 4)]);
          h$sp -= 5;
          h$r1 = h$RTS_246;
          return h$rs();
        };
      };
    case (5):
      h$p2(h$r1, h$return);
      return h$blockOnBlackhole(h$r1);
    default:
      throw(("panic: h$ap_4_4, unexpected closure type: " + h$RTS_240.t));
  };
};
h$o(h$ap_4_4, (-1), 0, 4, 256, null);
function h$ap_4_5()
{
  var h$RTS_251 = h$r1.f;
  switch (h$RTS_251.t)
  {
    case (0):
      return h$RTS_251;
    case (1):
      var h$RTS_253 = h$RTS_251.a;
      var h$RTS_254 = (h$RTS_253 & 255);
      if((4 === h$RTS_254))
      {
        h$r6 = h$stack[(h$sp - 5)];
        h$r5 = h$stack[(h$sp - 4)];
        h$r4 = h$stack[(h$sp - 3)];
        h$r3 = h$stack[(h$sp - 2)];
        h$r2 = h$stack[(h$sp - 1)];
        h$sp -= 6;
        return h$RTS_251;
      }
      else
      {
        if((4 > h$RTS_254))
        {
          var h$RTS_255 = (h$RTS_253 >> 8);
          switch (h$RTS_255)
          {
            case (5):
              h$r6 = h$stack[(h$sp - 5)];
            case (4):
              h$r5 = h$stack[(h$sp - 4)];
            case (3):
              h$r4 = h$stack[(h$sp - 3)];
            case (2):
              h$r3 = h$stack[(h$sp - 2)];
            case (1):
              h$r2 = h$stack[(h$sp - 1)];
            default:
          };
          h$sp -= h$RTS_255;
          var h$RTS_256 = h$apply[((4 - h$RTS_254) | ((5 - h$RTS_255) << 8))];
          h$stack[h$sp] = h$RTS_256;
          return h$RTS_251;
        }
        else
        {
          var h$RTS_252 = h$c7(h$pap_5, h$r1, ((((h$r1.f.t === 1) ? h$r1.f.a : h$r1.d2.d1) - 1280) - 4), h$stack[(h$sp - 1)],
          h$stack[(h$sp - 2)], h$stack[(h$sp - 3)], h$stack[(h$sp - 4)], h$stack[(h$sp - 5)]);
          h$sp -= 6;
          h$r1 = h$RTS_252;
          return h$rs();
        };
      };
    case (3):
      var h$RTS_258 = h$r1.d2.d1;
      var h$RTS_259 = (h$RTS_258 & 255);
      if((4 === h$RTS_259))
      {
        h$r6 = h$stack[(h$sp - 5)];
        h$r5 = h$stack[(h$sp - 4)];
        h$r4 = h$stack[(h$sp - 3)];
        h$r3 = h$stack[(h$sp - 2)];
        h$r2 = h$stack[(h$sp - 1)];
        h$sp -= 6;
        return h$RTS_251;
      }
      else
      {
        if((4 > h$RTS_259))
        {
          var h$RTS_260 = (h$RTS_258 >> 8);
          switch (h$RTS_260)
          {
            case (5):
              h$r6 = h$stack[(h$sp - 5)];
            case (4):
              h$r5 = h$stack[(h$sp - 4)];
            case (3):
              h$r4 = h$stack[(h$sp - 3)];
            case (2):
              h$r3 = h$stack[(h$sp - 2)];
            case (1):
              h$r2 = h$stack[(h$sp - 1)];
            default:
          };
          h$sp -= h$RTS_260;
          var h$RTS_261 = h$apply[((4 - h$RTS_259) | ((5 - h$RTS_260) << 8))];
          h$stack[h$sp] = h$RTS_261;
          return h$RTS_251;
        }
        else
        {
          var h$RTS_257 = h$c7(h$pap_5, h$r1, ((((h$r1.f.t === 1) ? h$r1.f.a : h$r1.d2.d1) - 1280) - 4), h$stack[(h$sp - 1)],
          h$stack[(h$sp - 2)], h$stack[(h$sp - 3)], h$stack[(h$sp - 4)], h$stack[(h$sp - 5)]);
          h$sp -= 6;
          h$r1 = h$RTS_257;
          return h$rs();
        };
      };
    case (5):
      h$p2(h$r1, h$return);
      return h$blockOnBlackhole(h$r1);
    default:
      throw(("panic: h$ap_4_5, unexpected closure type: " + h$RTS_251.t));
  };
};
h$o(h$ap_4_5, (-1), 0, 5, 256, null);
function h$ap_4_6()
{
  var h$RTS_262 = h$r1.f;
  switch (h$RTS_262.t)
  {
    case (0):
      return h$RTS_262;
    case (1):
      var h$RTS_264 = h$RTS_262.a;
      var h$RTS_265 = (h$RTS_264 & 255);
      if((4 === h$RTS_265))
      {
        h$r7 = h$stack[(h$sp - 6)];
        h$r6 = h$stack[(h$sp - 5)];
        h$r5 = h$stack[(h$sp - 4)];
        h$r4 = h$stack[(h$sp - 3)];
        h$r3 = h$stack[(h$sp - 2)];
        h$r2 = h$stack[(h$sp - 1)];
        h$sp -= 7;
        return h$RTS_262;
      }
      else
      {
        if((4 > h$RTS_265))
        {
          var h$RTS_266 = (h$RTS_264 >> 8);
          switch (h$RTS_266)
          {
            case (6):
              h$r7 = h$stack[(h$sp - 6)];
            case (5):
              h$r6 = h$stack[(h$sp - 5)];
            case (4):
              h$r5 = h$stack[(h$sp - 4)];
            case (3):
              h$r4 = h$stack[(h$sp - 3)];
            case (2):
              h$r3 = h$stack[(h$sp - 2)];
            case (1):
              h$r2 = h$stack[(h$sp - 1)];
            default:
          };
          h$sp -= h$RTS_266;
          var h$RTS_267 = h$apply[((4 - h$RTS_265) | ((6 - h$RTS_266) << 8))];
          h$stack[h$sp] = h$RTS_267;
          return h$RTS_262;
        }
        else
        {
          var h$RTS_263 = h$c8(h$pap_6, h$r1, ((((h$r1.f.t === 1) ? h$r1.f.a : h$r1.d2.d1) - 1536) - 4), h$stack[(h$sp - 1)],
          h$stack[(h$sp - 2)], h$stack[(h$sp - 3)], h$stack[(h$sp - 4)], h$stack[(h$sp - 5)], h$stack[(h$sp - 6)]);
          h$sp -= 7;
          h$r1 = h$RTS_263;
          return h$rs();
        };
      };
    case (3):
      var h$RTS_269 = h$r1.d2.d1;
      var h$RTS_270 = (h$RTS_269 & 255);
      if((4 === h$RTS_270))
      {
        h$r7 = h$stack[(h$sp - 6)];
        h$r6 = h$stack[(h$sp - 5)];
        h$r5 = h$stack[(h$sp - 4)];
        h$r4 = h$stack[(h$sp - 3)];
        h$r3 = h$stack[(h$sp - 2)];
        h$r2 = h$stack[(h$sp - 1)];
        h$sp -= 7;
        return h$RTS_262;
      }
      else
      {
        if((4 > h$RTS_270))
        {
          var h$RTS_271 = (h$RTS_269 >> 8);
          switch (h$RTS_271)
          {
            case (6):
              h$r7 = h$stack[(h$sp - 6)];
            case (5):
              h$r6 = h$stack[(h$sp - 5)];
            case (4):
              h$r5 = h$stack[(h$sp - 4)];
            case (3):
              h$r4 = h$stack[(h$sp - 3)];
            case (2):
              h$r3 = h$stack[(h$sp - 2)];
            case (1):
              h$r2 = h$stack[(h$sp - 1)];
            default:
          };
          h$sp -= h$RTS_271;
          var h$RTS_272 = h$apply[((4 - h$RTS_270) | ((6 - h$RTS_271) << 8))];
          h$stack[h$sp] = h$RTS_272;
          return h$RTS_262;
        }
        else
        {
          var h$RTS_268 = h$c8(h$pap_6, h$r1, ((((h$r1.f.t === 1) ? h$r1.f.a : h$r1.d2.d1) - 1536) - 4), h$stack[(h$sp - 1)],
          h$stack[(h$sp - 2)], h$stack[(h$sp - 3)], h$stack[(h$sp - 4)], h$stack[(h$sp - 5)], h$stack[(h$sp - 6)]);
          h$sp -= 7;
          h$r1 = h$RTS_268;
          return h$rs();
        };
      };
    case (5):
      h$p2(h$r1, h$return);
      return h$blockOnBlackhole(h$r1);
    default:
      throw(("panic: h$ap_4_6, unexpected closure type: " + h$RTS_262.t));
  };
};
h$o(h$ap_4_6, (-1), 0, 6, 256, null);
function h$ap_4_7()
{
  var h$RTS_273 = h$r1.f;
  switch (h$RTS_273.t)
  {
    case (0):
      return h$RTS_273;
    case (1):
      var h$RTS_275 = h$RTS_273.a;
      var h$RTS_276 = (h$RTS_275 & 255);
      if((4 === h$RTS_276))
      {
        h$r8 = h$stack[(h$sp - 7)];
        h$r7 = h$stack[(h$sp - 6)];
        h$r6 = h$stack[(h$sp - 5)];
        h$r5 = h$stack[(h$sp - 4)];
        h$r4 = h$stack[(h$sp - 3)];
        h$r3 = h$stack[(h$sp - 2)];
        h$r2 = h$stack[(h$sp - 1)];
        h$sp -= 8;
        return h$RTS_273;
      }
      else
      {
        if((4 > h$RTS_276))
        {
          var h$RTS_277 = (h$RTS_275 >> 8);
          switch (h$RTS_277)
          {
            case (7):
              h$r8 = h$stack[(h$sp - 7)];
            case (6):
              h$r7 = h$stack[(h$sp - 6)];
            case (5):
              h$r6 = h$stack[(h$sp - 5)];
            case (4):
              h$r5 = h$stack[(h$sp - 4)];
            case (3):
              h$r4 = h$stack[(h$sp - 3)];
            case (2):
              h$r3 = h$stack[(h$sp - 2)];
            case (1):
              h$r2 = h$stack[(h$sp - 1)];
            default:
          };
          h$sp -= h$RTS_277;
          var h$RTS_278 = h$apply[((4 - h$RTS_276) | ((7 - h$RTS_277) << 8))];
          h$stack[h$sp] = h$RTS_278;
          return h$RTS_273;
        }
        else
        {
          var h$RTS_274 = h$c9(h$pap_gen, h$r1, ((((h$r1.f.t === 1) ? h$r1.f.a : h$r1.d2.d1) - 1792) - 4), h$stack[(h$sp - 1)],
          h$stack[(h$sp - 2)], h$stack[(h$sp - 3)], h$stack[(h$sp - 4)], h$stack[(h$sp - 5)], h$stack[(h$sp - 6)],
          h$stack[(h$sp - 7)]);
          h$sp -= 8;
          h$r1 = h$RTS_274;
          return h$rs();
        };
      };
    case (3):
      var h$RTS_280 = h$r1.d2.d1;
      var h$RTS_281 = (h$RTS_280 & 255);
      if((4 === h$RTS_281))
      {
        h$r8 = h$stack[(h$sp - 7)];
        h$r7 = h$stack[(h$sp - 6)];
        h$r6 = h$stack[(h$sp - 5)];
        h$r5 = h$stack[(h$sp - 4)];
        h$r4 = h$stack[(h$sp - 3)];
        h$r3 = h$stack[(h$sp - 2)];
        h$r2 = h$stack[(h$sp - 1)];
        h$sp -= 8;
        return h$RTS_273;
      }
      else
      {
        if((4 > h$RTS_281))
        {
          var h$RTS_282 = (h$RTS_280 >> 8);
          switch (h$RTS_282)
          {
            case (7):
              h$r8 = h$stack[(h$sp - 7)];
            case (6):
              h$r7 = h$stack[(h$sp - 6)];
            case (5):
              h$r6 = h$stack[(h$sp - 5)];
            case (4):
              h$r5 = h$stack[(h$sp - 4)];
            case (3):
              h$r4 = h$stack[(h$sp - 3)];
            case (2):
              h$r3 = h$stack[(h$sp - 2)];
            case (1):
              h$r2 = h$stack[(h$sp - 1)];
            default:
          };
          h$sp -= h$RTS_282;
          var h$RTS_283 = h$apply[((4 - h$RTS_281) | ((7 - h$RTS_282) << 8))];
          h$stack[h$sp] = h$RTS_283;
          return h$RTS_273;
        }
        else
        {
          var h$RTS_279 = h$c9(h$pap_gen, h$r1, ((((h$r1.f.t === 1) ? h$r1.f.a : h$r1.d2.d1) - 1792) - 4), h$stack[(h$sp - 1)],
          h$stack[(h$sp - 2)], h$stack[(h$sp - 3)], h$stack[(h$sp - 4)], h$stack[(h$sp - 5)], h$stack[(h$sp - 6)],
          h$stack[(h$sp - 7)]);
          h$sp -= 8;
          h$r1 = h$RTS_279;
          return h$rs();
        };
      };
    case (5):
      h$p2(h$r1, h$return);
      return h$blockOnBlackhole(h$r1);
    default:
      throw(("panic: h$ap_4_7, unexpected closure type: " + h$RTS_273.t));
  };
};
h$o(h$ap_4_7, (-1), 0, 7, 256, null);
function h$ap_4_8()
{
  var h$RTS_284 = h$r1.f;
  switch (h$RTS_284.t)
  {
    case (0):
      return h$RTS_284;
    case (1):
      var h$RTS_286 = h$RTS_284.a;
      var h$RTS_287 = (h$RTS_286 & 255);
      if((4 === h$RTS_287))
      {
        h$r9 = h$stack[(h$sp - 8)];
        h$r8 = h$stack[(h$sp - 7)];
        h$r7 = h$stack[(h$sp - 6)];
        h$r6 = h$stack[(h$sp - 5)];
        h$r5 = h$stack[(h$sp - 4)];
        h$r4 = h$stack[(h$sp - 3)];
        h$r3 = h$stack[(h$sp - 2)];
        h$r2 = h$stack[(h$sp - 1)];
        h$sp -= 9;
        return h$RTS_284;
      }
      else
      {
        if((4 > h$RTS_287))
        {
          var h$RTS_288 = (h$RTS_286 >> 8);
          switch (h$RTS_288)
          {
            case (8):
              h$r9 = h$stack[(h$sp - 8)];
            case (7):
              h$r8 = h$stack[(h$sp - 7)];
            case (6):
              h$r7 = h$stack[(h$sp - 6)];
            case (5):
              h$r6 = h$stack[(h$sp - 5)];
            case (4):
              h$r5 = h$stack[(h$sp - 4)];
            case (3):
              h$r4 = h$stack[(h$sp - 3)];
            case (2):
              h$r3 = h$stack[(h$sp - 2)];
            case (1):
              h$r2 = h$stack[(h$sp - 1)];
            default:
          };
          h$sp -= h$RTS_288;
          var h$RTS_289 = h$apply[((4 - h$RTS_287) | ((8 - h$RTS_288) << 8))];
          h$stack[h$sp] = h$RTS_289;
          return h$RTS_284;
        }
        else
        {
          var h$RTS_285 = h$c10(h$pap_gen, h$r1, ((((h$r1.f.t === 1) ? h$r1.f.a : h$r1.d2.d1) - 2048) - 4), h$stack[(h$sp - 1)],
          h$stack[(h$sp - 2)], h$stack[(h$sp - 3)], h$stack[(h$sp - 4)], h$stack[(h$sp - 5)], h$stack[(h$sp - 6)],
          h$stack[(h$sp - 7)], h$stack[(h$sp - 8)]);
          h$sp -= 9;
          h$r1 = h$RTS_285;
          return h$rs();
        };
      };
    case (3):
      var h$RTS_291 = h$r1.d2.d1;
      var h$RTS_292 = (h$RTS_291 & 255);
      if((4 === h$RTS_292))
      {
        h$r9 = h$stack[(h$sp - 8)];
        h$r8 = h$stack[(h$sp - 7)];
        h$r7 = h$stack[(h$sp - 6)];
        h$r6 = h$stack[(h$sp - 5)];
        h$r5 = h$stack[(h$sp - 4)];
        h$r4 = h$stack[(h$sp - 3)];
        h$r3 = h$stack[(h$sp - 2)];
        h$r2 = h$stack[(h$sp - 1)];
        h$sp -= 9;
        return h$RTS_284;
      }
      else
      {
        if((4 > h$RTS_292))
        {
          var h$RTS_293 = (h$RTS_291 >> 8);
          switch (h$RTS_293)
          {
            case (8):
              h$r9 = h$stack[(h$sp - 8)];
            case (7):
              h$r8 = h$stack[(h$sp - 7)];
            case (6):
              h$r7 = h$stack[(h$sp - 6)];
            case (5):
              h$r6 = h$stack[(h$sp - 5)];
            case (4):
              h$r5 = h$stack[(h$sp - 4)];
            case (3):
              h$r4 = h$stack[(h$sp - 3)];
            case (2):
              h$r3 = h$stack[(h$sp - 2)];
            case (1):
              h$r2 = h$stack[(h$sp - 1)];
            default:
          };
          h$sp -= h$RTS_293;
          var h$RTS_294 = h$apply[((4 - h$RTS_292) | ((8 - h$RTS_293) << 8))];
          h$stack[h$sp] = h$RTS_294;
          return h$RTS_284;
        }
        else
        {
          var h$RTS_290 = h$c10(h$pap_gen, h$r1, ((((h$r1.f.t === 1) ? h$r1.f.a : h$r1.d2.d1) - 2048) - 4), h$stack[(h$sp - 1)],
          h$stack[(h$sp - 2)], h$stack[(h$sp - 3)], h$stack[(h$sp - 4)], h$stack[(h$sp - 5)], h$stack[(h$sp - 6)],
          h$stack[(h$sp - 7)], h$stack[(h$sp - 8)]);
          h$sp -= 9;
          h$r1 = h$RTS_290;
          return h$rs();
        };
      };
    case (5):
      h$p2(h$r1, h$return);
      return h$blockOnBlackhole(h$r1);
    default:
      throw(("panic: h$ap_4_8, unexpected closure type: " + h$RTS_284.t));
  };
};
h$o(h$ap_4_8, (-1), 0, 8, 256, null);
function h$ap_1_0_fast()
{
  var h$RTS_295 = h$r1.f;
  switch (h$RTS_295.t)
  {
    case (1):
      var h$RTS_296 = h$RTS_295.a;
      var h$RTS_298 = (h$RTS_296 & 255);
      if((1 === h$RTS_298))
      {
        return h$RTS_295;
      }
      else
      {
        if((1 > h$RTS_298))
        {
          var h$RTS_299 = (h$RTS_296 >> 8);
          var h$RTS_300 = (0 - h$RTS_299);
          switch (h$RTS_299)
          {
            default:
          };
          h$sp = ((h$sp + h$RTS_300) + 1);
          h$stack[h$sp] = h$apply[((h$RTS_300 << 8) | (1 - (h$RTS_296 & 255)))];
          return h$RTS_295;
        }
        else
        {
          var h$RTS_297 = h$c3(h$pap_0, h$r1, ((((h$r1.f.t === 1) ? h$r1.f.a : h$r1.d2.d1) - 0) - 1), null);
          h$r1 = h$RTS_297;
          return h$rs();
        };
      };
    case (3):
      var h$RTS_301 = h$r1.d2.d1;
      var h$RTS_303 = (h$RTS_301 & 255);
      if((1 === h$RTS_303))
      {
        return h$RTS_295;
      }
      else
      {
        if((1 > h$RTS_303))
        {
          var h$RTS_304 = (h$RTS_301 >> 8);
          var h$RTS_305 = (0 - h$RTS_304);
          switch (h$RTS_304)
          {
            default:
          };
          h$sp = ((h$sp + h$RTS_305) + 1);
          h$stack[h$sp] = h$apply[((h$RTS_305 << 8) | (1 - (h$RTS_301 & 255)))];
          return h$RTS_295;
        }
        else
        {
          var h$RTS_302 = h$c3(h$pap_0, h$r1, ((((h$r1.f.t === 1) ? h$r1.f.a : h$r1.d2.d1) - 0) - 1), null);
          h$r1 = h$RTS_302;
          return h$rs();
        };
      };
    case (0):
      ++h$sp;
      h$stack[h$sp] = h$ap_1_0;
      return h$RTS_295;
    case (5):
      ++h$sp;
      h$stack[h$sp] = h$ap_1_0;
      h$p2(h$r1, h$return);
      return h$blockOnBlackhole(h$r1);
    default:
      throw(("h$ap_1_0_fast: unexpected closure type: " + h$RTS_295.t));
  };
};
function h$ap_1_1_fast()
{
  var h$RTS_306 = h$r1.f;
  switch (h$RTS_306.t)
  {
    case (1):
      var h$RTS_307 = h$RTS_306.a;
      var h$RTS_309 = (h$RTS_307 & 255);
      if((1 === h$RTS_309))
      {
        return h$RTS_306;
      }
      else
      {
        if((1 > h$RTS_309))
        {
          var h$RTS_310 = (h$RTS_307 >> 8);
          var h$RTS_311 = (1 - h$RTS_310);
          switch (h$RTS_310)
          {
            case (0):
              h$stack[(h$sp + 1)] = h$r2;
            default:
          };
          h$sp = ((h$sp + h$RTS_311) + 1);
          h$stack[h$sp] = h$apply[((h$RTS_311 << 8) | (1 - (h$RTS_307 & 255)))];
          return h$RTS_306;
        }
        else
        {
          var h$RTS_308 = h$c3(h$pap_1, h$r1, ((((h$r1.f.t === 1) ? h$r1.f.a : h$r1.d2.d1) - 256) - 1), h$r2);
          h$r1 = h$RTS_308;
          return h$rs();
        };
      };
    case (3):
      var h$RTS_312 = h$r1.d2.d1;
      var h$RTS_314 = (h$RTS_312 & 255);
      if((1 === h$RTS_314))
      {
        return h$RTS_306;
      }
      else
      {
        if((1 > h$RTS_314))
        {
          var h$RTS_315 = (h$RTS_312 >> 8);
          var h$RTS_316 = (1 - h$RTS_315);
          switch (h$RTS_315)
          {
            case (0):
              h$stack[(h$sp + 1)] = h$r2;
            default:
          };
          h$sp = ((h$sp + h$RTS_316) + 1);
          h$stack[h$sp] = h$apply[((h$RTS_316 << 8) | (1 - (h$RTS_312 & 255)))];
          return h$RTS_306;
        }
        else
        {
          var h$RTS_313 = h$c3(h$pap_1, h$r1, ((((h$r1.f.t === 1) ? h$r1.f.a : h$r1.d2.d1) - 256) - 1), h$r2);
          h$r1 = h$RTS_313;
          return h$rs();
        };
      };
    case (0):
      h$p2(h$r2, h$ap_1_1);
      return h$RTS_306;
    case (5):
      h$p2(h$r2, h$ap_1_1);
      h$p2(h$r1, h$return);
      return h$blockOnBlackhole(h$r1);
    default:
      throw(("h$ap_1_1_fast: unexpected closure type: " + h$RTS_306.t));
  };
};
function h$ap_1_2_fast()
{
  var h$RTS_317 = h$r1.f;
  switch (h$RTS_317.t)
  {
    case (1):
      var h$RTS_318 = h$RTS_317.a;
      var h$RTS_320 = (h$RTS_318 & 255);
      if((1 === h$RTS_320))
      {
        return h$RTS_317;
      }
      else
      {
        if((1 > h$RTS_320))
        {
          var h$RTS_321 = (h$RTS_318 >> 8);
          var h$RTS_322 = (2 - h$RTS_321);
          switch (h$RTS_321)
          {
            case (0):
              h$stack[(h$sp + 2)] = h$r2;
            case (1):
              h$stack[(h$sp + 1)] = h$r3;
            default:
          };
          h$sp = ((h$sp + h$RTS_322) + 1);
          h$stack[h$sp] = h$apply[((h$RTS_322 << 8) | (1 - (h$RTS_318 & 255)))];
          return h$RTS_317;
        }
        else
        {
          var h$RTS_319 = h$c4(h$pap_2, h$r1, ((((h$r1.f.t === 1) ? h$r1.f.a : h$r1.d2.d1) - 512) - 1), h$r2, h$r3);
          h$r1 = h$RTS_319;
          return h$rs();
        };
      };
    case (3):
      var h$RTS_323 = h$r1.d2.d1;
      var h$RTS_325 = (h$RTS_323 & 255);
      if((1 === h$RTS_325))
      {
        return h$RTS_317;
      }
      else
      {
        if((1 > h$RTS_325))
        {
          var h$RTS_326 = (h$RTS_323 >> 8);
          var h$RTS_327 = (2 - h$RTS_326);
          switch (h$RTS_326)
          {
            case (0):
              h$stack[(h$sp + 2)] = h$r2;
            case (1):
              h$stack[(h$sp + 1)] = h$r3;
            default:
          };
          h$sp = ((h$sp + h$RTS_327) + 1);
          h$stack[h$sp] = h$apply[((h$RTS_327 << 8) | (1 - (h$RTS_323 & 255)))];
          return h$RTS_317;
        }
        else
        {
          var h$RTS_324 = h$c4(h$pap_2, h$r1, ((((h$r1.f.t === 1) ? h$r1.f.a : h$r1.d2.d1) - 512) - 1), h$r2, h$r3);
          h$r1 = h$RTS_324;
          return h$rs();
        };
      };
    case (0):
      h$p3(h$r3, h$r2, h$ap_1_2);
      return h$RTS_317;
    case (5):
      h$p3(h$r3, h$r2, h$ap_1_2);
      h$p2(h$r1, h$return);
      return h$blockOnBlackhole(h$r1);
    default:
      throw(("h$ap_1_2_fast: unexpected closure type: " + h$RTS_317.t));
  };
};
function h$ap_2_1_fast()
{
  var h$RTS_328 = h$r1.f;
  switch (h$RTS_328.t)
  {
    case (1):
      var h$RTS_329 = h$RTS_328.a;
      var h$RTS_331 = (h$RTS_329 & 255);
      if((2 === h$RTS_331))
      {
        return h$RTS_328;
      }
      else
      {
        if((2 > h$RTS_331))
        {
          var h$RTS_332 = (h$RTS_329 >> 8);
          var h$RTS_333 = (1 - h$RTS_332);
          switch (h$RTS_332)
          {
            case (0):
              h$stack[(h$sp + 1)] = h$r2;
            default:
          };
          h$sp = ((h$sp + h$RTS_333) + 1);
          h$stack[h$sp] = h$apply[((h$RTS_333 << 8) | (2 - (h$RTS_329 & 255)))];
          return h$RTS_328;
        }
        else
        {
          var h$RTS_330 = h$c3(h$pap_1, h$r1, ((((h$r1.f.t === 1) ? h$r1.f.a : h$r1.d2.d1) - 256) - 2), h$r2);
          h$r1 = h$RTS_330;
          return h$rs();
        };
      };
    case (3):
      var h$RTS_334 = h$r1.d2.d1;
      var h$RTS_336 = (h$RTS_334 & 255);
      if((2 === h$RTS_336))
      {
        return h$RTS_328;
      }
      else
      {
        if((2 > h$RTS_336))
        {
          var h$RTS_337 = (h$RTS_334 >> 8);
          var h$RTS_338 = (1 - h$RTS_337);
          switch (h$RTS_337)
          {
            case (0):
              h$stack[(h$sp + 1)] = h$r2;
            default:
          };
          h$sp = ((h$sp + h$RTS_338) + 1);
          h$stack[h$sp] = h$apply[((h$RTS_338 << 8) | (2 - (h$RTS_334 & 255)))];
          return h$RTS_328;
        }
        else
        {
          var h$RTS_335 = h$c3(h$pap_1, h$r1, ((((h$r1.f.t === 1) ? h$r1.f.a : h$r1.d2.d1) - 256) - 2), h$r2);
          h$r1 = h$RTS_335;
          return h$rs();
        };
      };
    case (0):
      h$p2(h$r2, h$ap_2_1);
      return h$RTS_328;
    case (5):
      h$p2(h$r2, h$ap_2_1);
      h$p2(h$r1, h$return);
      return h$blockOnBlackhole(h$r1);
    default:
      throw(("h$ap_2_1_fast: unexpected closure type: " + h$RTS_328.t));
  };
};
function h$ap_2_2_fast()
{
  var h$RTS_339 = h$r1.f;
  switch (h$RTS_339.t)
  {
    case (1):
      var h$RTS_340 = h$RTS_339.a;
      var h$RTS_342 = (h$RTS_340 & 255);
      if((2 === h$RTS_342))
      {
        return h$RTS_339;
      }
      else
      {
        if((2 > h$RTS_342))
        {
          var h$RTS_343 = (h$RTS_340 >> 8);
          var h$RTS_344 = (2 - h$RTS_343);
          switch (h$RTS_343)
          {
            case (0):
              h$stack[(h$sp + 2)] = h$r2;
            case (1):
              h$stack[(h$sp + 1)] = h$r3;
            default:
          };
          h$sp = ((h$sp + h$RTS_344) + 1);
          h$stack[h$sp] = h$apply[((h$RTS_344 << 8) | (2 - (h$RTS_340 & 255)))];
          return h$RTS_339;
        }
        else
        {
          var h$RTS_341 = h$c4(h$pap_2, h$r1, ((((h$r1.f.t === 1) ? h$r1.f.a : h$r1.d2.d1) - 512) - 2), h$r2, h$r3);
          h$r1 = h$RTS_341;
          return h$rs();
        };
      };
    case (3):
      var h$RTS_345 = h$r1.d2.d1;
      var h$RTS_347 = (h$RTS_345 & 255);
      if((2 === h$RTS_347))
      {
        return h$RTS_339;
      }
      else
      {
        if((2 > h$RTS_347))
        {
          var h$RTS_348 = (h$RTS_345 >> 8);
          var h$RTS_349 = (2 - h$RTS_348);
          switch (h$RTS_348)
          {
            case (0):
              h$stack[(h$sp + 2)] = h$r2;
            case (1):
              h$stack[(h$sp + 1)] = h$r3;
            default:
          };
          h$sp = ((h$sp + h$RTS_349) + 1);
          h$stack[h$sp] = h$apply[((h$RTS_349 << 8) | (2 - (h$RTS_345 & 255)))];
          return h$RTS_339;
        }
        else
        {
          var h$RTS_346 = h$c4(h$pap_2, h$r1, ((((h$r1.f.t === 1) ? h$r1.f.a : h$r1.d2.d1) - 512) - 2), h$r2, h$r3);
          h$r1 = h$RTS_346;
          return h$rs();
        };
      };
    case (0):
      h$p3(h$r3, h$r2, h$ap_2_2);
      return h$RTS_339;
    case (5):
      h$p3(h$r3, h$r2, h$ap_2_2);
      h$p2(h$r1, h$return);
      return h$blockOnBlackhole(h$r1);
    default:
      throw(("h$ap_2_2_fast: unexpected closure type: " + h$RTS_339.t));
  };
};
function h$ap_2_3_fast()
{
  var h$RTS_350 = h$r1.f;
  switch (h$RTS_350.t)
  {
    case (1):
      var h$RTS_351 = h$RTS_350.a;
      var h$RTS_353 = (h$RTS_351 & 255);
      if((2 === h$RTS_353))
      {
        return h$RTS_350;
      }
      else
      {
        if((2 > h$RTS_353))
        {
          var h$RTS_354 = (h$RTS_351 >> 8);
          var h$RTS_355 = (3 - h$RTS_354);
          switch (h$RTS_354)
          {
            case (0):
              h$stack[(h$sp + 3)] = h$r2;
            case (1):
              h$stack[(h$sp + 2)] = h$r3;
            case (2):
              h$stack[(h$sp + 1)] = h$r4;
            default:
          };
          h$sp = ((h$sp + h$RTS_355) + 1);
          h$stack[h$sp] = h$apply[((h$RTS_355 << 8) | (2 - (h$RTS_351 & 255)))];
          return h$RTS_350;
        }
        else
        {
          var h$RTS_352 = h$c5(h$pap_3, h$r1, ((((h$r1.f.t === 1) ? h$r1.f.a : h$r1.d2.d1) - 768) - 2), h$r2, h$r3, h$r4);
          h$r1 = h$RTS_352;
          return h$rs();
        };
      };
    case (3):
      var h$RTS_356 = h$r1.d2.d1;
      var h$RTS_358 = (h$RTS_356 & 255);
      if((2 === h$RTS_358))
      {
        return h$RTS_350;
      }
      else
      {
        if((2 > h$RTS_358))
        {
          var h$RTS_359 = (h$RTS_356 >> 8);
          var h$RTS_360 = (3 - h$RTS_359);
          switch (h$RTS_359)
          {
            case (0):
              h$stack[(h$sp + 3)] = h$r2;
            case (1):
              h$stack[(h$sp + 2)] = h$r3;
            case (2):
              h$stack[(h$sp + 1)] = h$r4;
            default:
          };
          h$sp = ((h$sp + h$RTS_360) + 1);
          h$stack[h$sp] = h$apply[((h$RTS_360 << 8) | (2 - (h$RTS_356 & 255)))];
          return h$RTS_350;
        }
        else
        {
          var h$RTS_357 = h$c5(h$pap_3, h$r1, ((((h$r1.f.t === 1) ? h$r1.f.a : h$r1.d2.d1) - 768) - 2), h$r2, h$r3, h$r4);
          h$r1 = h$RTS_357;
          return h$rs();
        };
      };
    case (0):
      h$p4(h$r4, h$r3, h$r2, h$ap_2_3);
      return h$RTS_350;
    case (5):
      h$p4(h$r4, h$r3, h$r2, h$ap_2_3);
      h$p2(h$r1, h$return);
      return h$blockOnBlackhole(h$r1);
    default:
      throw(("h$ap_2_3_fast: unexpected closure type: " + h$RTS_350.t));
  };
};
function h$ap_2_4_fast()
{
  var h$RTS_361 = h$r1.f;
  switch (h$RTS_361.t)
  {
    case (1):
      var h$RTS_362 = h$RTS_361.a;
      var h$RTS_364 = (h$RTS_362 & 255);
      if((2 === h$RTS_364))
      {
        return h$RTS_361;
      }
      else
      {
        if((2 > h$RTS_364))
        {
          var h$RTS_365 = (h$RTS_362 >> 8);
          var h$RTS_366 = (4 - h$RTS_365);
          switch (h$RTS_365)
          {
            case (0):
              h$stack[(h$sp + 4)] = h$r2;
            case (1):
              h$stack[(h$sp + 3)] = h$r3;
            case (2):
              h$stack[(h$sp + 2)] = h$r4;
            case (3):
              h$stack[(h$sp + 1)] = h$r5;
            default:
          };
          h$sp = ((h$sp + h$RTS_366) + 1);
          h$stack[h$sp] = h$apply[((h$RTS_366 << 8) | (2 - (h$RTS_362 & 255)))];
          return h$RTS_361;
        }
        else
        {
          var h$RTS_363 = h$c6(h$pap_4, h$r1, ((((h$r1.f.t === 1) ? h$r1.f.a : h$r1.d2.d1) - 1024) - 2), h$r2, h$r3, h$r4, h$r5);
          h$r1 = h$RTS_363;
          return h$rs();
        };
      };
    case (3):
      var h$RTS_367 = h$r1.d2.d1;
      var h$RTS_369 = (h$RTS_367 & 255);
      if((2 === h$RTS_369))
      {
        return h$RTS_361;
      }
      else
      {
        if((2 > h$RTS_369))
        {
          var h$RTS_370 = (h$RTS_367 >> 8);
          var h$RTS_371 = (4 - h$RTS_370);
          switch (h$RTS_370)
          {
            case (0):
              h$stack[(h$sp + 4)] = h$r2;
            case (1):
              h$stack[(h$sp + 3)] = h$r3;
            case (2):
              h$stack[(h$sp + 2)] = h$r4;
            case (3):
              h$stack[(h$sp + 1)] = h$r5;
            default:
          };
          h$sp = ((h$sp + h$RTS_371) + 1);
          h$stack[h$sp] = h$apply[((h$RTS_371 << 8) | (2 - (h$RTS_367 & 255)))];
          return h$RTS_361;
        }
        else
        {
          var h$RTS_368 = h$c6(h$pap_4, h$r1, ((((h$r1.f.t === 1) ? h$r1.f.a : h$r1.d2.d1) - 1024) - 2), h$r2, h$r3, h$r4, h$r5);
          h$r1 = h$RTS_368;
          return h$rs();
        };
      };
    case (0):
      h$p5(h$r5, h$r4, h$r3, h$r2, h$ap_2_4);
      return h$RTS_361;
    case (5):
      h$p5(h$r5, h$r4, h$r3, h$r2, h$ap_2_4);
      h$p2(h$r1, h$return);
      return h$blockOnBlackhole(h$r1);
    default:
      throw(("h$ap_2_4_fast: unexpected closure type: " + h$RTS_361.t));
  };
};
function h$ap_3_2_fast()
{
  var h$RTS_372 = h$r1.f;
  switch (h$RTS_372.t)
  {
    case (1):
      var h$RTS_373 = h$RTS_372.a;
      var h$RTS_375 = (h$RTS_373 & 255);
      if((3 === h$RTS_375))
      {
        return h$RTS_372;
      }
      else
      {
        if((3 > h$RTS_375))
        {
          var h$RTS_376 = (h$RTS_373 >> 8);
          var h$RTS_377 = (2 - h$RTS_376);
          switch (h$RTS_376)
          {
            case (0):
              h$stack[(h$sp + 2)] = h$r2;
            case (1):
              h$stack[(h$sp + 1)] = h$r3;
            default:
          };
          h$sp = ((h$sp + h$RTS_377) + 1);
          h$stack[h$sp] = h$apply[((h$RTS_377 << 8) | (3 - (h$RTS_373 & 255)))];
          return h$RTS_372;
        }
        else
        {
          var h$RTS_374 = h$c4(h$pap_2, h$r1, ((((h$r1.f.t === 1) ? h$r1.f.a : h$r1.d2.d1) - 512) - 3), h$r2, h$r3);
          h$r1 = h$RTS_374;
          return h$rs();
        };
      };
    case (3):
      var h$RTS_378 = h$r1.d2.d1;
      var h$RTS_380 = (h$RTS_378 & 255);
      if((3 === h$RTS_380))
      {
        return h$RTS_372;
      }
      else
      {
        if((3 > h$RTS_380))
        {
          var h$RTS_381 = (h$RTS_378 >> 8);
          var h$RTS_382 = (2 - h$RTS_381);
          switch (h$RTS_381)
          {
            case (0):
              h$stack[(h$sp + 2)] = h$r2;
            case (1):
              h$stack[(h$sp + 1)] = h$r3;
            default:
          };
          h$sp = ((h$sp + h$RTS_382) + 1);
          h$stack[h$sp] = h$apply[((h$RTS_382 << 8) | (3 - (h$RTS_378 & 255)))];
          return h$RTS_372;
        }
        else
        {
          var h$RTS_379 = h$c4(h$pap_2, h$r1, ((((h$r1.f.t === 1) ? h$r1.f.a : h$r1.d2.d1) - 512) - 3), h$r2, h$r3);
          h$r1 = h$RTS_379;
          return h$rs();
        };
      };
    case (0):
      h$p3(h$r3, h$r2, h$ap_3_2);
      return h$RTS_372;
    case (5):
      h$p3(h$r3, h$r2, h$ap_3_2);
      h$p2(h$r1, h$return);
      return h$blockOnBlackhole(h$r1);
    default:
      throw(("h$ap_3_2_fast: unexpected closure type: " + h$RTS_372.t));
  };
};
function h$ap_3_3_fast()
{
  var h$RTS_383 = h$r1.f;
  switch (h$RTS_383.t)
  {
    case (1):
      var h$RTS_384 = h$RTS_383.a;
      var h$RTS_386 = (h$RTS_384 & 255);
      if((3 === h$RTS_386))
      {
        return h$RTS_383;
      }
      else
      {
        if((3 > h$RTS_386))
        {
          var h$RTS_387 = (h$RTS_384 >> 8);
          var h$RTS_388 = (3 - h$RTS_387);
          switch (h$RTS_387)
          {
            case (0):
              h$stack[(h$sp + 3)] = h$r2;
            case (1):
              h$stack[(h$sp + 2)] = h$r3;
            case (2):
              h$stack[(h$sp + 1)] = h$r4;
            default:
          };
          h$sp = ((h$sp + h$RTS_388) + 1);
          h$stack[h$sp] = h$apply[((h$RTS_388 << 8) | (3 - (h$RTS_384 & 255)))];
          return h$RTS_383;
        }
        else
        {
          var h$RTS_385 = h$c5(h$pap_3, h$r1, ((((h$r1.f.t === 1) ? h$r1.f.a : h$r1.d2.d1) - 768) - 3), h$r2, h$r3, h$r4);
          h$r1 = h$RTS_385;
          return h$rs();
        };
      };
    case (3):
      var h$RTS_389 = h$r1.d2.d1;
      var h$RTS_391 = (h$RTS_389 & 255);
      if((3 === h$RTS_391))
      {
        return h$RTS_383;
      }
      else
      {
        if((3 > h$RTS_391))
        {
          var h$RTS_392 = (h$RTS_389 >> 8);
          var h$RTS_393 = (3 - h$RTS_392);
          switch (h$RTS_392)
          {
            case (0):
              h$stack[(h$sp + 3)] = h$r2;
            case (1):
              h$stack[(h$sp + 2)] = h$r3;
            case (2):
              h$stack[(h$sp + 1)] = h$r4;
            default:
          };
          h$sp = ((h$sp + h$RTS_393) + 1);
          h$stack[h$sp] = h$apply[((h$RTS_393 << 8) | (3 - (h$RTS_389 & 255)))];
          return h$RTS_383;
        }
        else
        {
          var h$RTS_390 = h$c5(h$pap_3, h$r1, ((((h$r1.f.t === 1) ? h$r1.f.a : h$r1.d2.d1) - 768) - 3), h$r2, h$r3, h$r4);
          h$r1 = h$RTS_390;
          return h$rs();
        };
      };
    case (0):
      h$p4(h$r4, h$r3, h$r2, h$ap_3_3);
      return h$RTS_383;
    case (5):
      h$p4(h$r4, h$r3, h$r2, h$ap_3_3);
      h$p2(h$r1, h$return);
      return h$blockOnBlackhole(h$r1);
    default:
      throw(("h$ap_3_3_fast: unexpected closure type: " + h$RTS_383.t));
  };
};
function h$ap_3_4_fast()
{
  var h$RTS_394 = h$r1.f;
  switch (h$RTS_394.t)
  {
    case (1):
      var h$RTS_395 = h$RTS_394.a;
      var h$RTS_397 = (h$RTS_395 & 255);
      if((3 === h$RTS_397))
      {
        return h$RTS_394;
      }
      else
      {
        if((3 > h$RTS_397))
        {
          var h$RTS_398 = (h$RTS_395 >> 8);
          var h$RTS_399 = (4 - h$RTS_398);
          switch (h$RTS_398)
          {
            case (0):
              h$stack[(h$sp + 4)] = h$r2;
            case (1):
              h$stack[(h$sp + 3)] = h$r3;
            case (2):
              h$stack[(h$sp + 2)] = h$r4;
            case (3):
              h$stack[(h$sp + 1)] = h$r5;
            default:
          };
          h$sp = ((h$sp + h$RTS_399) + 1);
          h$stack[h$sp] = h$apply[((h$RTS_399 << 8) | (3 - (h$RTS_395 & 255)))];
          return h$RTS_394;
        }
        else
        {
          var h$RTS_396 = h$c6(h$pap_4, h$r1, ((((h$r1.f.t === 1) ? h$r1.f.a : h$r1.d2.d1) - 1024) - 3), h$r2, h$r3, h$r4, h$r5);
          h$r1 = h$RTS_396;
          return h$rs();
        };
      };
    case (3):
      var h$RTS_400 = h$r1.d2.d1;
      var h$RTS_402 = (h$RTS_400 & 255);
      if((3 === h$RTS_402))
      {
        return h$RTS_394;
      }
      else
      {
        if((3 > h$RTS_402))
        {
          var h$RTS_403 = (h$RTS_400 >> 8);
          var h$RTS_404 = (4 - h$RTS_403);
          switch (h$RTS_403)
          {
            case (0):
              h$stack[(h$sp + 4)] = h$r2;
            case (1):
              h$stack[(h$sp + 3)] = h$r3;
            case (2):
              h$stack[(h$sp + 2)] = h$r4;
            case (3):
              h$stack[(h$sp + 1)] = h$r5;
            default:
          };
          h$sp = ((h$sp + h$RTS_404) + 1);
          h$stack[h$sp] = h$apply[((h$RTS_404 << 8) | (3 - (h$RTS_400 & 255)))];
          return h$RTS_394;
        }
        else
        {
          var h$RTS_401 = h$c6(h$pap_4, h$r1, ((((h$r1.f.t === 1) ? h$r1.f.a : h$r1.d2.d1) - 1024) - 3), h$r2, h$r3, h$r4, h$r5);
          h$r1 = h$RTS_401;
          return h$rs();
        };
      };
    case (0):
      h$p5(h$r5, h$r4, h$r3, h$r2, h$ap_3_4);
      return h$RTS_394;
    case (5):
      h$p5(h$r5, h$r4, h$r3, h$r2, h$ap_3_4);
      h$p2(h$r1, h$return);
      return h$blockOnBlackhole(h$r1);
    default:
      throw(("h$ap_3_4_fast: unexpected closure type: " + h$RTS_394.t));
  };
};
function h$ap_3_5_fast()
{
  var h$RTS_405 = h$r1.f;
  switch (h$RTS_405.t)
  {
    case (1):
      var h$RTS_406 = h$RTS_405.a;
      var h$RTS_408 = (h$RTS_406 & 255);
      if((3 === h$RTS_408))
      {
        return h$RTS_405;
      }
      else
      {
        if((3 > h$RTS_408))
        {
          var h$RTS_409 = (h$RTS_406 >> 8);
          var h$RTS_410 = (5 - h$RTS_409);
          switch (h$RTS_409)
          {
            case (0):
              h$stack[(h$sp + 5)] = h$r2;
            case (1):
              h$stack[(h$sp + 4)] = h$r3;
            case (2):
              h$stack[(h$sp + 3)] = h$r4;
            case (3):
              h$stack[(h$sp + 2)] = h$r5;
            case (4):
              h$stack[(h$sp + 1)] = h$r6;
            default:
          };
          h$sp = ((h$sp + h$RTS_410) + 1);
          h$stack[h$sp] = h$apply[((h$RTS_410 << 8) | (3 - (h$RTS_406 & 255)))];
          return h$RTS_405;
        }
        else
        {
          var h$RTS_407 = h$c7(h$pap_5, h$r1, ((((h$r1.f.t === 1) ? h$r1.f.a : h$r1.d2.d1) - 1280) - 3), h$r2, h$r3, h$r4, h$r5,
          h$r6);
          h$r1 = h$RTS_407;
          return h$rs();
        };
      };
    case (3):
      var h$RTS_411 = h$r1.d2.d1;
      var h$RTS_413 = (h$RTS_411 & 255);
      if((3 === h$RTS_413))
      {
        return h$RTS_405;
      }
      else
      {
        if((3 > h$RTS_413))
        {
          var h$RTS_414 = (h$RTS_411 >> 8);
          var h$RTS_415 = (5 - h$RTS_414);
          switch (h$RTS_414)
          {
            case (0):
              h$stack[(h$sp + 5)] = h$r2;
            case (1):
              h$stack[(h$sp + 4)] = h$r3;
            case (2):
              h$stack[(h$sp + 3)] = h$r4;
            case (3):
              h$stack[(h$sp + 2)] = h$r5;
            case (4):
              h$stack[(h$sp + 1)] = h$r6;
            default:
          };
          h$sp = ((h$sp + h$RTS_415) + 1);
          h$stack[h$sp] = h$apply[((h$RTS_415 << 8) | (3 - (h$RTS_411 & 255)))];
          return h$RTS_405;
        }
        else
        {
          var h$RTS_412 = h$c7(h$pap_5, h$r1, ((((h$r1.f.t === 1) ? h$r1.f.a : h$r1.d2.d1) - 1280) - 3), h$r2, h$r3, h$r4, h$r5,
          h$r6);
          h$r1 = h$RTS_412;
          return h$rs();
        };
      };
    case (0):
      h$p6(h$r6, h$r5, h$r4, h$r3, h$r2, h$ap_3_5);
      return h$RTS_405;
    case (5):
      h$p6(h$r6, h$r5, h$r4, h$r3, h$r2, h$ap_3_5);
      h$p2(h$r1, h$return);
      return h$blockOnBlackhole(h$r1);
    default:
      throw(("h$ap_3_5_fast: unexpected closure type: " + h$RTS_405.t));
  };
};
function h$ap_3_6_fast()
{
  var h$RTS_416 = h$r1.f;
  switch (h$RTS_416.t)
  {
    case (1):
      var h$RTS_417 = h$RTS_416.a;
      var h$RTS_419 = (h$RTS_417 & 255);
      if((3 === h$RTS_419))
      {
        return h$RTS_416;
      }
      else
      {
        if((3 > h$RTS_419))
        {
          var h$RTS_420 = (h$RTS_417 >> 8);
          var h$RTS_421 = (6 - h$RTS_420);
          switch (h$RTS_420)
          {
            case (0):
              h$stack[(h$sp + 6)] = h$r2;
            case (1):
              h$stack[(h$sp + 5)] = h$r3;
            case (2):
              h$stack[(h$sp + 4)] = h$r4;
            case (3):
              h$stack[(h$sp + 3)] = h$r5;
            case (4):
              h$stack[(h$sp + 2)] = h$r6;
            case (5):
              h$stack[(h$sp + 1)] = h$r7;
            default:
          };
          h$sp = ((h$sp + h$RTS_421) + 1);
          h$stack[h$sp] = h$apply[((h$RTS_421 << 8) | (3 - (h$RTS_417 & 255)))];
          return h$RTS_416;
        }
        else
        {
          var h$RTS_418 = h$c8(h$pap_6, h$r1, ((((h$r1.f.t === 1) ? h$r1.f.a : h$r1.d2.d1) - 1536) - 3), h$r2, h$r3, h$r4, h$r5,
          h$r6, h$r7);
          h$r1 = h$RTS_418;
          return h$rs();
        };
      };
    case (3):
      var h$RTS_422 = h$r1.d2.d1;
      var h$RTS_424 = (h$RTS_422 & 255);
      if((3 === h$RTS_424))
      {
        return h$RTS_416;
      }
      else
      {
        if((3 > h$RTS_424))
        {
          var h$RTS_425 = (h$RTS_422 >> 8);
          var h$RTS_426 = (6 - h$RTS_425);
          switch (h$RTS_425)
          {
            case (0):
              h$stack[(h$sp + 6)] = h$r2;
            case (1):
              h$stack[(h$sp + 5)] = h$r3;
            case (2):
              h$stack[(h$sp + 4)] = h$r4;
            case (3):
              h$stack[(h$sp + 3)] = h$r5;
            case (4):
              h$stack[(h$sp + 2)] = h$r6;
            case (5):
              h$stack[(h$sp + 1)] = h$r7;
            default:
          };
          h$sp = ((h$sp + h$RTS_426) + 1);
          h$stack[h$sp] = h$apply[((h$RTS_426 << 8) | (3 - (h$RTS_422 & 255)))];
          return h$RTS_416;
        }
        else
        {
          var h$RTS_423 = h$c8(h$pap_6, h$r1, ((((h$r1.f.t === 1) ? h$r1.f.a : h$r1.d2.d1) - 1536) - 3), h$r2, h$r3, h$r4, h$r5,
          h$r6, h$r7);
          h$r1 = h$RTS_423;
          return h$rs();
        };
      };
    case (0):
      h$p7(h$r7, h$r6, h$r5, h$r4, h$r3, h$r2, h$ap_3_6);
      return h$RTS_416;
    case (5):
      h$p7(h$r7, h$r6, h$r5, h$r4, h$r3, h$r2, h$ap_3_6);
      h$p2(h$r1, h$return);
      return h$blockOnBlackhole(h$r1);
    default:
      throw(("h$ap_3_6_fast: unexpected closure type: " + h$RTS_416.t));
  };
};
function h$ap_4_3_fast()
{
  var h$RTS_427 = h$r1.f;
  switch (h$RTS_427.t)
  {
    case (1):
      var h$RTS_428 = h$RTS_427.a;
      var h$RTS_430 = (h$RTS_428 & 255);
      if((4 === h$RTS_430))
      {
        return h$RTS_427;
      }
      else
      {
        if((4 > h$RTS_430))
        {
          var h$RTS_431 = (h$RTS_428 >> 8);
          var h$RTS_432 = (3 - h$RTS_431);
          switch (h$RTS_431)
          {
            case (0):
              h$stack[(h$sp + 3)] = h$r2;
            case (1):
              h$stack[(h$sp + 2)] = h$r3;
            case (2):
              h$stack[(h$sp + 1)] = h$r4;
            default:
          };
          h$sp = ((h$sp + h$RTS_432) + 1);
          h$stack[h$sp] = h$apply[((h$RTS_432 << 8) | (4 - (h$RTS_428 & 255)))];
          return h$RTS_427;
        }
        else
        {
          var h$RTS_429 = h$c5(h$pap_3, h$r1, ((((h$r1.f.t === 1) ? h$r1.f.a : h$r1.d2.d1) - 768) - 4), h$r2, h$r3, h$r4);
          h$r1 = h$RTS_429;
          return h$rs();
        };
      };
    case (3):
      var h$RTS_433 = h$r1.d2.d1;
      var h$RTS_435 = (h$RTS_433 & 255);
      if((4 === h$RTS_435))
      {
        return h$RTS_427;
      }
      else
      {
        if((4 > h$RTS_435))
        {
          var h$RTS_436 = (h$RTS_433 >> 8);
          var h$RTS_437 = (3 - h$RTS_436);
          switch (h$RTS_436)
          {
            case (0):
              h$stack[(h$sp + 3)] = h$r2;
            case (1):
              h$stack[(h$sp + 2)] = h$r3;
            case (2):
              h$stack[(h$sp + 1)] = h$r4;
            default:
          };
          h$sp = ((h$sp + h$RTS_437) + 1);
          h$stack[h$sp] = h$apply[((h$RTS_437 << 8) | (4 - (h$RTS_433 & 255)))];
          return h$RTS_427;
        }
        else
        {
          var h$RTS_434 = h$c5(h$pap_3, h$r1, ((((h$r1.f.t === 1) ? h$r1.f.a : h$r1.d2.d1) - 768) - 4), h$r2, h$r3, h$r4);
          h$r1 = h$RTS_434;
          return h$rs();
        };
      };
    case (0):
      h$p4(h$r4, h$r3, h$r2, h$ap_4_3);
      return h$RTS_427;
    case (5):
      h$p4(h$r4, h$r3, h$r2, h$ap_4_3);
      h$p2(h$r1, h$return);
      return h$blockOnBlackhole(h$r1);
    default:
      throw(("h$ap_4_3_fast: unexpected closure type: " + h$RTS_427.t));
  };
};
function h$ap_4_4_fast()
{
  var h$RTS_438 = h$r1.f;
  switch (h$RTS_438.t)
  {
    case (1):
      var h$RTS_439 = h$RTS_438.a;
      var h$RTS_441 = (h$RTS_439 & 255);
      if((4 === h$RTS_441))
      {
        return h$RTS_438;
      }
      else
      {
        if((4 > h$RTS_441))
        {
          var h$RTS_442 = (h$RTS_439 >> 8);
          var h$RTS_443 = (4 - h$RTS_442);
          switch (h$RTS_442)
          {
            case (0):
              h$stack[(h$sp + 4)] = h$r2;
            case (1):
              h$stack[(h$sp + 3)] = h$r3;
            case (2):
              h$stack[(h$sp + 2)] = h$r4;
            case (3):
              h$stack[(h$sp + 1)] = h$r5;
            default:
          };
          h$sp = ((h$sp + h$RTS_443) + 1);
          h$stack[h$sp] = h$apply[((h$RTS_443 << 8) | (4 - (h$RTS_439 & 255)))];
          return h$RTS_438;
        }
        else
        {
          var h$RTS_440 = h$c6(h$pap_4, h$r1, ((((h$r1.f.t === 1) ? h$r1.f.a : h$r1.d2.d1) - 1024) - 4), h$r2, h$r3, h$r4, h$r5);
          h$r1 = h$RTS_440;
          return h$rs();
        };
      };
    case (3):
      var h$RTS_444 = h$r1.d2.d1;
      var h$RTS_446 = (h$RTS_444 & 255);
      if((4 === h$RTS_446))
      {
        return h$RTS_438;
      }
      else
      {
        if((4 > h$RTS_446))
        {
          var h$RTS_447 = (h$RTS_444 >> 8);
          var h$RTS_448 = (4 - h$RTS_447);
          switch (h$RTS_447)
          {
            case (0):
              h$stack[(h$sp + 4)] = h$r2;
            case (1):
              h$stack[(h$sp + 3)] = h$r3;
            case (2):
              h$stack[(h$sp + 2)] = h$r4;
            case (3):
              h$stack[(h$sp + 1)] = h$r5;
            default:
          };
          h$sp = ((h$sp + h$RTS_448) + 1);
          h$stack[h$sp] = h$apply[((h$RTS_448 << 8) | (4 - (h$RTS_444 & 255)))];
          return h$RTS_438;
        }
        else
        {
          var h$RTS_445 = h$c6(h$pap_4, h$r1, ((((h$r1.f.t === 1) ? h$r1.f.a : h$r1.d2.d1) - 1024) - 4), h$r2, h$r3, h$r4, h$r5);
          h$r1 = h$RTS_445;
          return h$rs();
        };
      };
    case (0):
      h$p5(h$r5, h$r4, h$r3, h$r2, h$ap_4_4);
      return h$RTS_438;
    case (5):
      h$p5(h$r5, h$r4, h$r3, h$r2, h$ap_4_4);
      h$p2(h$r1, h$return);
      return h$blockOnBlackhole(h$r1);
    default:
      throw(("h$ap_4_4_fast: unexpected closure type: " + h$RTS_438.t));
  };
};
function h$ap_4_5_fast()
{
  var h$RTS_449 = h$r1.f;
  switch (h$RTS_449.t)
  {
    case (1):
      var h$RTS_450 = h$RTS_449.a;
      var h$RTS_452 = (h$RTS_450 & 255);
      if((4 === h$RTS_452))
      {
        return h$RTS_449;
      }
      else
      {
        if((4 > h$RTS_452))
        {
          var h$RTS_453 = (h$RTS_450 >> 8);
          var h$RTS_454 = (5 - h$RTS_453);
          switch (h$RTS_453)
          {
            case (0):
              h$stack[(h$sp + 5)] = h$r2;
            case (1):
              h$stack[(h$sp + 4)] = h$r3;
            case (2):
              h$stack[(h$sp + 3)] = h$r4;
            case (3):
              h$stack[(h$sp + 2)] = h$r5;
            case (4):
              h$stack[(h$sp + 1)] = h$r6;
            default:
          };
          h$sp = ((h$sp + h$RTS_454) + 1);
          h$stack[h$sp] = h$apply[((h$RTS_454 << 8) | (4 - (h$RTS_450 & 255)))];
          return h$RTS_449;
        }
        else
        {
          var h$RTS_451 = h$c7(h$pap_5, h$r1, ((((h$r1.f.t === 1) ? h$r1.f.a : h$r1.d2.d1) - 1280) - 4), h$r2, h$r3, h$r4, h$r5,
          h$r6);
          h$r1 = h$RTS_451;
          return h$rs();
        };
      };
    case (3):
      var h$RTS_455 = h$r1.d2.d1;
      var h$RTS_457 = (h$RTS_455 & 255);
      if((4 === h$RTS_457))
      {
        return h$RTS_449;
      }
      else
      {
        if((4 > h$RTS_457))
        {
          var h$RTS_458 = (h$RTS_455 >> 8);
          var h$RTS_459 = (5 - h$RTS_458);
          switch (h$RTS_458)
          {
            case (0):
              h$stack[(h$sp + 5)] = h$r2;
            case (1):
              h$stack[(h$sp + 4)] = h$r3;
            case (2):
              h$stack[(h$sp + 3)] = h$r4;
            case (3):
              h$stack[(h$sp + 2)] = h$r5;
            case (4):
              h$stack[(h$sp + 1)] = h$r6;
            default:
          };
          h$sp = ((h$sp + h$RTS_459) + 1);
          h$stack[h$sp] = h$apply[((h$RTS_459 << 8) | (4 - (h$RTS_455 & 255)))];
          return h$RTS_449;
        }
        else
        {
          var h$RTS_456 = h$c7(h$pap_5, h$r1, ((((h$r1.f.t === 1) ? h$r1.f.a : h$r1.d2.d1) - 1280) - 4), h$r2, h$r3, h$r4, h$r5,
          h$r6);
          h$r1 = h$RTS_456;
          return h$rs();
        };
      };
    case (0):
      h$p6(h$r6, h$r5, h$r4, h$r3, h$r2, h$ap_4_5);
      return h$RTS_449;
    case (5):
      h$p6(h$r6, h$r5, h$r4, h$r3, h$r2, h$ap_4_5);
      h$p2(h$r1, h$return);
      return h$blockOnBlackhole(h$r1);
    default:
      throw(("h$ap_4_5_fast: unexpected closure type: " + h$RTS_449.t));
  };
};
function h$ap_4_6_fast()
{
  var h$RTS_460 = h$r1.f;
  switch (h$RTS_460.t)
  {
    case (1):
      var h$RTS_461 = h$RTS_460.a;
      var h$RTS_463 = (h$RTS_461 & 255);
      if((4 === h$RTS_463))
      {
        return h$RTS_460;
      }
      else
      {
        if((4 > h$RTS_463))
        {
          var h$RTS_464 = (h$RTS_461 >> 8);
          var h$RTS_465 = (6 - h$RTS_464);
          switch (h$RTS_464)
          {
            case (0):
              h$stack[(h$sp + 6)] = h$r2;
            case (1):
              h$stack[(h$sp + 5)] = h$r3;
            case (2):
              h$stack[(h$sp + 4)] = h$r4;
            case (3):
              h$stack[(h$sp + 3)] = h$r5;
            case (4):
              h$stack[(h$sp + 2)] = h$r6;
            case (5):
              h$stack[(h$sp + 1)] = h$r7;
            default:
          };
          h$sp = ((h$sp + h$RTS_465) + 1);
          h$stack[h$sp] = h$apply[((h$RTS_465 << 8) | (4 - (h$RTS_461 & 255)))];
          return h$RTS_460;
        }
        else
        {
          var h$RTS_462 = h$c8(h$pap_6, h$r1, ((((h$r1.f.t === 1) ? h$r1.f.a : h$r1.d2.d1) - 1536) - 4), h$r2, h$r3, h$r4, h$r5,
          h$r6, h$r7);
          h$r1 = h$RTS_462;
          return h$rs();
        };
      };
    case (3):
      var h$RTS_466 = h$r1.d2.d1;
      var h$RTS_468 = (h$RTS_466 & 255);
      if((4 === h$RTS_468))
      {
        return h$RTS_460;
      }
      else
      {
        if((4 > h$RTS_468))
        {
          var h$RTS_469 = (h$RTS_466 >> 8);
          var h$RTS_470 = (6 - h$RTS_469);
          switch (h$RTS_469)
          {
            case (0):
              h$stack[(h$sp + 6)] = h$r2;
            case (1):
              h$stack[(h$sp + 5)] = h$r3;
            case (2):
              h$stack[(h$sp + 4)] = h$r4;
            case (3):
              h$stack[(h$sp + 3)] = h$r5;
            case (4):
              h$stack[(h$sp + 2)] = h$r6;
            case (5):
              h$stack[(h$sp + 1)] = h$r7;
            default:
          };
          h$sp = ((h$sp + h$RTS_470) + 1);
          h$stack[h$sp] = h$apply[((h$RTS_470 << 8) | (4 - (h$RTS_466 & 255)))];
          return h$RTS_460;
        }
        else
        {
          var h$RTS_467 = h$c8(h$pap_6, h$r1, ((((h$r1.f.t === 1) ? h$r1.f.a : h$r1.d2.d1) - 1536) - 4), h$r2, h$r3, h$r4, h$r5,
          h$r6, h$r7);
          h$r1 = h$RTS_467;
          return h$rs();
        };
      };
    case (0):
      h$p7(h$r7, h$r6, h$r5, h$r4, h$r3, h$r2, h$ap_4_6);
      return h$RTS_460;
    case (5):
      h$p7(h$r7, h$r6, h$r5, h$r4, h$r3, h$r2, h$ap_4_6);
      h$p2(h$r1, h$return);
      return h$blockOnBlackhole(h$r1);
    default:
      throw(("h$ap_4_6_fast: unexpected closure type: " + h$RTS_460.t));
  };
};
function h$ap_4_7_fast()
{
  var h$RTS_471 = h$r1.f;
  switch (h$RTS_471.t)
  {
    case (1):
      var h$RTS_472 = h$RTS_471.a;
      var h$RTS_474 = (h$RTS_472 & 255);
      if((4 === h$RTS_474))
      {
        return h$RTS_471;
      }
      else
      {
        if((4 > h$RTS_474))
        {
          var h$RTS_475 = (h$RTS_472 >> 8);
          var h$RTS_476 = (7 - h$RTS_475);
          switch (h$RTS_475)
          {
            case (0):
              h$stack[(h$sp + 7)] = h$r2;
            case (1):
              h$stack[(h$sp + 6)] = h$r3;
            case (2):
              h$stack[(h$sp + 5)] = h$r4;
            case (3):
              h$stack[(h$sp + 4)] = h$r5;
            case (4):
              h$stack[(h$sp + 3)] = h$r6;
            case (5):
              h$stack[(h$sp + 2)] = h$r7;
            case (6):
              h$stack[(h$sp + 1)] = h$r8;
            default:
          };
          h$sp = ((h$sp + h$RTS_476) + 1);
          h$stack[h$sp] = h$apply[((h$RTS_476 << 8) | (4 - (h$RTS_472 & 255)))];
          return h$RTS_471;
        }
        else
        {
          var h$RTS_473 = h$c9(h$pap_gen, h$r1, ((((h$r1.f.t === 1) ? h$r1.f.a : h$r1.d2.d1) - 1792) - 4), h$r2, h$r3, h$r4, h$r5,
          h$r6, h$r7, h$r8);
          h$r1 = h$RTS_473;
          return h$rs();
        };
      };
    case (3):
      var h$RTS_477 = h$r1.d2.d1;
      var h$RTS_479 = (h$RTS_477 & 255);
      if((4 === h$RTS_479))
      {
        return h$RTS_471;
      }
      else
      {
        if((4 > h$RTS_479))
        {
          var h$RTS_480 = (h$RTS_477 >> 8);
          var h$RTS_481 = (7 - h$RTS_480);
          switch (h$RTS_480)
          {
            case (0):
              h$stack[(h$sp + 7)] = h$r2;
            case (1):
              h$stack[(h$sp + 6)] = h$r3;
            case (2):
              h$stack[(h$sp + 5)] = h$r4;
            case (3):
              h$stack[(h$sp + 4)] = h$r5;
            case (4):
              h$stack[(h$sp + 3)] = h$r6;
            case (5):
              h$stack[(h$sp + 2)] = h$r7;
            case (6):
              h$stack[(h$sp + 1)] = h$r8;
            default:
          };
          h$sp = ((h$sp + h$RTS_481) + 1);
          h$stack[h$sp] = h$apply[((h$RTS_481 << 8) | (4 - (h$RTS_477 & 255)))];
          return h$RTS_471;
        }
        else
        {
          var h$RTS_478 = h$c9(h$pap_gen, h$r1, ((((h$r1.f.t === 1) ? h$r1.f.a : h$r1.d2.d1) - 1792) - 4), h$r2, h$r3, h$r4, h$r5,
          h$r6, h$r7, h$r8);
          h$r1 = h$RTS_478;
          return h$rs();
        };
      };
    case (0):
      h$p8(h$r8, h$r7, h$r6, h$r5, h$r4, h$r3, h$r2, h$ap_4_7);
      return h$RTS_471;
    case (5):
      h$p8(h$r8, h$r7, h$r6, h$r5, h$r4, h$r3, h$r2, h$ap_4_7);
      h$p2(h$r1, h$return);
      return h$blockOnBlackhole(h$r1);
    default:
      throw(("h$ap_4_7_fast: unexpected closure type: " + h$RTS_471.t));
  };
};
function h$ap_4_8_fast()
{
  var h$RTS_482 = h$r1.f;
  switch (h$RTS_482.t)
  {
    case (1):
      var h$RTS_483 = h$RTS_482.a;
      var h$RTS_485 = (h$RTS_483 & 255);
      if((4 === h$RTS_485))
      {
        return h$RTS_482;
      }
      else
      {
        if((4 > h$RTS_485))
        {
          var h$RTS_486 = (h$RTS_483 >> 8);
          var h$RTS_487 = (8 - h$RTS_486);
          switch (h$RTS_486)
          {
            case (0):
              h$stack[(h$sp + 8)] = h$r2;
            case (1):
              h$stack[(h$sp + 7)] = h$r3;
            case (2):
              h$stack[(h$sp + 6)] = h$r4;
            case (3):
              h$stack[(h$sp + 5)] = h$r5;
            case (4):
              h$stack[(h$sp + 4)] = h$r6;
            case (5):
              h$stack[(h$sp + 3)] = h$r7;
            case (6):
              h$stack[(h$sp + 2)] = h$r8;
            case (7):
              h$stack[(h$sp + 1)] = h$r9;
            default:
          };
          h$sp = ((h$sp + h$RTS_487) + 1);
          h$stack[h$sp] = h$apply[((h$RTS_487 << 8) | (4 - (h$RTS_483 & 255)))];
          return h$RTS_482;
        }
        else
        {
          var h$RTS_484 = h$c10(h$pap_gen, h$r1, ((((h$r1.f.t === 1) ? h$r1.f.a : h$r1.d2.d1) - 2048) - 4), h$r2, h$r3, h$r4,
          h$r5, h$r6, h$r7, h$r8, h$r9);
          h$r1 = h$RTS_484;
          return h$rs();
        };
      };
    case (3):
      var h$RTS_488 = h$r1.d2.d1;
      var h$RTS_490 = (h$RTS_488 & 255);
      if((4 === h$RTS_490))
      {
        return h$RTS_482;
      }
      else
      {
        if((4 > h$RTS_490))
        {
          var h$RTS_491 = (h$RTS_488 >> 8);
          var h$RTS_492 = (8 - h$RTS_491);
          switch (h$RTS_491)
          {
            case (0):
              h$stack[(h$sp + 8)] = h$r2;
            case (1):
              h$stack[(h$sp + 7)] = h$r3;
            case (2):
              h$stack[(h$sp + 6)] = h$r4;
            case (3):
              h$stack[(h$sp + 5)] = h$r5;
            case (4):
              h$stack[(h$sp + 4)] = h$r6;
            case (5):
              h$stack[(h$sp + 3)] = h$r7;
            case (6):
              h$stack[(h$sp + 2)] = h$r8;
            case (7):
              h$stack[(h$sp + 1)] = h$r9;
            default:
          };
          h$sp = ((h$sp + h$RTS_492) + 1);
          h$stack[h$sp] = h$apply[((h$RTS_492 << 8) | (4 - (h$RTS_488 & 255)))];
          return h$RTS_482;
        }
        else
        {
          var h$RTS_489 = h$c10(h$pap_gen, h$r1, ((((h$r1.f.t === 1) ? h$r1.f.a : h$r1.d2.d1) - 2048) - 4), h$r2, h$r3, h$r4,
          h$r5, h$r6, h$r7, h$r8, h$r9);
          h$r1 = h$RTS_489;
          return h$rs();
        };
      };
    case (0):
      h$p9(h$r9, h$r8, h$r7, h$r6, h$r5, h$r4, h$r3, h$r2, h$ap_4_8);
      return h$RTS_482;
    case (5):
      h$p9(h$r9, h$r8, h$r7, h$r6, h$r5, h$r4, h$r3, h$r2, h$ap_4_8);
      h$p2(h$r1, h$return);
      return h$blockOnBlackhole(h$r1);
    default:
      throw(("h$ap_4_8_fast: unexpected closure type: " + h$RTS_482.t));
  };
};
function h$pap_0()
{
  var h$RTS_493 = h$r1.d1;
  var h$RTS_494 = h$r1.d2;
  var h$RTS_495 = h$RTS_493.f;
  var h$RTS_496 = ((((h$RTS_495.t === 1) ? h$RTS_495.a : h$RTS_493.d2.d1) >> 8) - 0);
  switch (h$RTS_496)
  {
    case (127):
      h$regs[95] = h$regs[95];
    case (126):
      h$regs[94] = h$regs[94];
    case (125):
      h$regs[93] = h$regs[93];
    case (124):
      h$regs[92] = h$regs[92];
    case (123):
      h$regs[91] = h$regs[91];
    case (122):
      h$regs[90] = h$regs[90];
    case (121):
      h$regs[89] = h$regs[89];
    case (120):
      h$regs[88] = h$regs[88];
    case (119):
      h$regs[87] = h$regs[87];
    case (118):
      h$regs[86] = h$regs[86];
    case (117):
      h$regs[85] = h$regs[85];
    case (116):
      h$regs[84] = h$regs[84];
    case (115):
      h$regs[83] = h$regs[83];
    case (114):
      h$regs[82] = h$regs[82];
    case (113):
      h$regs[81] = h$regs[81];
    case (112):
      h$regs[80] = h$regs[80];
    case (111):
      h$regs[79] = h$regs[79];
    case (110):
      h$regs[78] = h$regs[78];
    case (109):
      h$regs[77] = h$regs[77];
    case (108):
      h$regs[76] = h$regs[76];
    case (107):
      h$regs[75] = h$regs[75];
    case (106):
      h$regs[74] = h$regs[74];
    case (105):
      h$regs[73] = h$regs[73];
    case (104):
      h$regs[72] = h$regs[72];
    case (103):
      h$regs[71] = h$regs[71];
    case (102):
      h$regs[70] = h$regs[70];
    case (101):
      h$regs[69] = h$regs[69];
    case (100):
      h$regs[68] = h$regs[68];
    case (99):
      h$regs[67] = h$regs[67];
    case (98):
      h$regs[66] = h$regs[66];
    case (97):
      h$regs[65] = h$regs[65];
    case (96):
      h$regs[64] = h$regs[64];
    case (95):
      h$regs[63] = h$regs[63];
    case (94):
      h$regs[62] = h$regs[62];
    case (93):
      h$regs[61] = h$regs[61];
    case (92):
      h$regs[60] = h$regs[60];
    case (91):
      h$regs[59] = h$regs[59];
    case (90):
      h$regs[58] = h$regs[58];
    case (89):
      h$regs[57] = h$regs[57];
    case (88):
      h$regs[56] = h$regs[56];
    case (87):
      h$regs[55] = h$regs[55];
    case (86):
      h$regs[54] = h$regs[54];
    case (85):
      h$regs[53] = h$regs[53];
    case (84):
      h$regs[52] = h$regs[52];
    case (83):
      h$regs[51] = h$regs[51];
    case (82):
      h$regs[50] = h$regs[50];
    case (81):
      h$regs[49] = h$regs[49];
    case (80):
      h$regs[48] = h$regs[48];
    case (79):
      h$regs[47] = h$regs[47];
    case (78):
      h$regs[46] = h$regs[46];
    case (77):
      h$regs[45] = h$regs[45];
    case (76):
      h$regs[44] = h$regs[44];
    case (75):
      h$regs[43] = h$regs[43];
    case (74):
      h$regs[42] = h$regs[42];
    case (73):
      h$regs[41] = h$regs[41];
    case (72):
      h$regs[40] = h$regs[40];
    case (71):
      h$regs[39] = h$regs[39];
    case (70):
      h$regs[38] = h$regs[38];
    case (69):
      h$regs[37] = h$regs[37];
    case (68):
      h$regs[36] = h$regs[36];
    case (67):
      h$regs[35] = h$regs[35];
    case (66):
      h$regs[34] = h$regs[34];
    case (65):
      h$regs[33] = h$regs[33];
    case (64):
      h$regs[32] = h$regs[32];
    case (63):
      h$regs[31] = h$regs[31];
    case (62):
      h$regs[30] = h$regs[30];
    case (61):
      h$regs[29] = h$regs[29];
    case (60):
      h$regs[28] = h$regs[28];
    case (59):
      h$regs[27] = h$regs[27];
    case (58):
      h$regs[26] = h$regs[26];
    case (57):
      h$regs[25] = h$regs[25];
    case (56):
      h$regs[24] = h$regs[24];
    case (55):
      h$regs[23] = h$regs[23];
    case (54):
      h$regs[22] = h$regs[22];
    case (53):
      h$regs[21] = h$regs[21];
    case (52):
      h$regs[20] = h$regs[20];
    case (51):
      h$regs[19] = h$regs[19];
    case (50):
      h$regs[18] = h$regs[18];
    case (49):
      h$regs[17] = h$regs[17];
    case (48):
      h$regs[16] = h$regs[16];
    case (47):
      h$regs[15] = h$regs[15];
    case (46):
      h$regs[14] = h$regs[14];
    case (45):
      h$regs[13] = h$regs[13];
    case (44):
      h$regs[12] = h$regs[12];
    case (43):
      h$regs[11] = h$regs[11];
    case (42):
      h$regs[10] = h$regs[10];
    case (41):
      h$regs[9] = h$regs[9];
    case (40):
      h$regs[8] = h$regs[8];
    case (39):
      h$regs[7] = h$regs[7];
    case (38):
      h$regs[6] = h$regs[6];
    case (37):
      h$regs[5] = h$regs[5];
    case (36):
      h$regs[4] = h$regs[4];
    case (35):
      h$regs[3] = h$regs[3];
    case (34):
      h$regs[2] = h$regs[2];
    case (33):
      h$regs[1] = h$regs[1];
    case (32):
      h$regs[0] = h$regs[0];
    case (31):
      h$r32 = h$r32;
    case (30):
      h$r31 = h$r31;
    case (29):
      h$r30 = h$r30;
    case (28):
      h$r29 = h$r29;
    case (27):
      h$r28 = h$r28;
    case (26):
      h$r27 = h$r27;
    case (25):
      h$r26 = h$r26;
    case (24):
      h$r25 = h$r25;
    case (23):
      h$r24 = h$r24;
    case (22):
      h$r23 = h$r23;
    case (21):
      h$r22 = h$r22;
    case (20):
      h$r21 = h$r21;
    case (19):
      h$r20 = h$r20;
    case (18):
      h$r19 = h$r19;
    case (17):
      h$r18 = h$r18;
    case (16):
      h$r17 = h$r17;
    case (15):
      h$r16 = h$r16;
    case (14):
      h$r15 = h$r15;
    case (13):
      h$r14 = h$r14;
    case (12):
      h$r13 = h$r13;
    case (11):
      h$r12 = h$r12;
    case (10):
      h$r11 = h$r11;
    case (9):
      h$r10 = h$r10;
    case (8):
      h$r9 = h$r9;
    case (7):
      h$r8 = h$r8;
    case (6):
      h$r7 = h$r7;
    case (5):
      h$r6 = h$r6;
    case (4):
      h$r5 = h$r5;
    case (3):
      h$r4 = h$r4;
    case (2):
      h$r3 = h$r3;
    case (1):
      h$r2 = h$r2;
    default:
  };
  h$r1 = h$RTS_493;
  return h$RTS_495;
};
h$o(h$pap_0, 3, 0, 2, (-1), null);
function h$pap_1()
{
  var h$RTS_497 = h$r1.d1;
  var h$RTS_498 = h$r1.d2;
  var h$RTS_499 = h$RTS_497.f;
  var h$RTS_500 = ((((h$RTS_499.t === 1) ? h$RTS_499.a : h$RTS_497.d2.d1) >> 8) - 1);
  switch (h$RTS_500)
  {
    case (126):
      h$regs[95] = h$regs[94];
    case (125):
      h$regs[94] = h$regs[93];
    case (124):
      h$regs[93] = h$regs[92];
    case (123):
      h$regs[92] = h$regs[91];
    case (122):
      h$regs[91] = h$regs[90];
    case (121):
      h$regs[90] = h$regs[89];
    case (120):
      h$regs[89] = h$regs[88];
    case (119):
      h$regs[88] = h$regs[87];
    case (118):
      h$regs[87] = h$regs[86];
    case (117):
      h$regs[86] = h$regs[85];
    case (116):
      h$regs[85] = h$regs[84];
    case (115):
      h$regs[84] = h$regs[83];
    case (114):
      h$regs[83] = h$regs[82];
    case (113):
      h$regs[82] = h$regs[81];
    case (112):
      h$regs[81] = h$regs[80];
    case (111):
      h$regs[80] = h$regs[79];
    case (110):
      h$regs[79] = h$regs[78];
    case (109):
      h$regs[78] = h$regs[77];
    case (108):
      h$regs[77] = h$regs[76];
    case (107):
      h$regs[76] = h$regs[75];
    case (106):
      h$regs[75] = h$regs[74];
    case (105):
      h$regs[74] = h$regs[73];
    case (104):
      h$regs[73] = h$regs[72];
    case (103):
      h$regs[72] = h$regs[71];
    case (102):
      h$regs[71] = h$regs[70];
    case (101):
      h$regs[70] = h$regs[69];
    case (100):
      h$regs[69] = h$regs[68];
    case (99):
      h$regs[68] = h$regs[67];
    case (98):
      h$regs[67] = h$regs[66];
    case (97):
      h$regs[66] = h$regs[65];
    case (96):
      h$regs[65] = h$regs[64];
    case (95):
      h$regs[64] = h$regs[63];
    case (94):
      h$regs[63] = h$regs[62];
    case (93):
      h$regs[62] = h$regs[61];
    case (92):
      h$regs[61] = h$regs[60];
    case (91):
      h$regs[60] = h$regs[59];
    case (90):
      h$regs[59] = h$regs[58];
    case (89):
      h$regs[58] = h$regs[57];
    case (88):
      h$regs[57] = h$regs[56];
    case (87):
      h$regs[56] = h$regs[55];
    case (86):
      h$regs[55] = h$regs[54];
    case (85):
      h$regs[54] = h$regs[53];
    case (84):
      h$regs[53] = h$regs[52];
    case (83):
      h$regs[52] = h$regs[51];
    case (82):
      h$regs[51] = h$regs[50];
    case (81):
      h$regs[50] = h$regs[49];
    case (80):
      h$regs[49] = h$regs[48];
    case (79):
      h$regs[48] = h$regs[47];
    case (78):
      h$regs[47] = h$regs[46];
    case (77):
      h$regs[46] = h$regs[45];
    case (76):
      h$regs[45] = h$regs[44];
    case (75):
      h$regs[44] = h$regs[43];
    case (74):
      h$regs[43] = h$regs[42];
    case (73):
      h$regs[42] = h$regs[41];
    case (72):
      h$regs[41] = h$regs[40];
    case (71):
      h$regs[40] = h$regs[39];
    case (70):
      h$regs[39] = h$regs[38];
    case (69):
      h$regs[38] = h$regs[37];
    case (68):
      h$regs[37] = h$regs[36];
    case (67):
      h$regs[36] = h$regs[35];
    case (66):
      h$regs[35] = h$regs[34];
    case (65):
      h$regs[34] = h$regs[33];
    case (64):
      h$regs[33] = h$regs[32];
    case (63):
      h$regs[32] = h$regs[31];
    case (62):
      h$regs[31] = h$regs[30];
    case (61):
      h$regs[30] = h$regs[29];
    case (60):
      h$regs[29] = h$regs[28];
    case (59):
      h$regs[28] = h$regs[27];
    case (58):
      h$regs[27] = h$regs[26];
    case (57):
      h$regs[26] = h$regs[25];
    case (56):
      h$regs[25] = h$regs[24];
    case (55):
      h$regs[24] = h$regs[23];
    case (54):
      h$regs[23] = h$regs[22];
    case (53):
      h$regs[22] = h$regs[21];
    case (52):
      h$regs[21] = h$regs[20];
    case (51):
      h$regs[20] = h$regs[19];
    case (50):
      h$regs[19] = h$regs[18];
    case (49):
      h$regs[18] = h$regs[17];
    case (48):
      h$regs[17] = h$regs[16];
    case (47):
      h$regs[16] = h$regs[15];
    case (46):
      h$regs[15] = h$regs[14];
    case (45):
      h$regs[14] = h$regs[13];
    case (44):
      h$regs[13] = h$regs[12];
    case (43):
      h$regs[12] = h$regs[11];
    case (42):
      h$regs[11] = h$regs[10];
    case (41):
      h$regs[10] = h$regs[9];
    case (40):
      h$regs[9] = h$regs[8];
    case (39):
      h$regs[8] = h$regs[7];
    case (38):
      h$regs[7] = h$regs[6];
    case (37):
      h$regs[6] = h$regs[5];
    case (36):
      h$regs[5] = h$regs[4];
    case (35):
      h$regs[4] = h$regs[3];
    case (34):
      h$regs[3] = h$regs[2];
    case (33):
      h$regs[2] = h$regs[1];
    case (32):
      h$regs[1] = h$regs[0];
    case (31):
      h$regs[0] = h$r32;
    case (30):
      h$r32 = h$r31;
    case (29):
      h$r31 = h$r30;
    case (28):
      h$r30 = h$r29;
    case (27):
      h$r29 = h$r28;
    case (26):
      h$r28 = h$r27;
    case (25):
      h$r27 = h$r26;
    case (24):
      h$r26 = h$r25;
    case (23):
      h$r25 = h$r24;
    case (22):
      h$r24 = h$r23;
    case (21):
      h$r23 = h$r22;
    case (20):
      h$r22 = h$r21;
    case (19):
      h$r21 = h$r20;
    case (18):
      h$r20 = h$r19;
    case (17):
      h$r19 = h$r18;
    case (16):
      h$r18 = h$r17;
    case (15):
      h$r17 = h$r16;
    case (14):
      h$r16 = h$r15;
    case (13):
      h$r15 = h$r14;
    case (12):
      h$r14 = h$r13;
    case (11):
      h$r13 = h$r12;
    case (10):
      h$r12 = h$r11;
    case (9):
      h$r11 = h$r10;
    case (8):
      h$r10 = h$r9;
    case (7):
      h$r9 = h$r8;
    case (6):
      h$r8 = h$r7;
    case (5):
      h$r7 = h$r6;
    case (4):
      h$r6 = h$r5;
    case (3):
      h$r5 = h$r4;
    case (2):
      h$r4 = h$r3;
    case (1):
      h$r3 = h$r2;
    default:
  };
  h$r2 = h$RTS_498.d2;
  h$r1 = h$RTS_497;
  return h$RTS_499;
};
h$o(h$pap_1, 3, 0, 3, (-1), null);
function h$pap_2()
{
  var h$RTS_501 = h$r1.d1;
  var h$RTS_502 = h$r1.d2;
  var h$RTS_503 = h$RTS_501.f;
  var h$RTS_504 = ((((h$RTS_503.t === 1) ? h$RTS_503.a : h$RTS_501.d2.d1) >> 8) - 2);
  switch (h$RTS_504)
  {
    case (125):
      h$regs[95] = h$regs[93];
    case (124):
      h$regs[94] = h$regs[92];
    case (123):
      h$regs[93] = h$regs[91];
    case (122):
      h$regs[92] = h$regs[90];
    case (121):
      h$regs[91] = h$regs[89];
    case (120):
      h$regs[90] = h$regs[88];
    case (119):
      h$regs[89] = h$regs[87];
    case (118):
      h$regs[88] = h$regs[86];
    case (117):
      h$regs[87] = h$regs[85];
    case (116):
      h$regs[86] = h$regs[84];
    case (115):
      h$regs[85] = h$regs[83];
    case (114):
      h$regs[84] = h$regs[82];
    case (113):
      h$regs[83] = h$regs[81];
    case (112):
      h$regs[82] = h$regs[80];
    case (111):
      h$regs[81] = h$regs[79];
    case (110):
      h$regs[80] = h$regs[78];
    case (109):
      h$regs[79] = h$regs[77];
    case (108):
      h$regs[78] = h$regs[76];
    case (107):
      h$regs[77] = h$regs[75];
    case (106):
      h$regs[76] = h$regs[74];
    case (105):
      h$regs[75] = h$regs[73];
    case (104):
      h$regs[74] = h$regs[72];
    case (103):
      h$regs[73] = h$regs[71];
    case (102):
      h$regs[72] = h$regs[70];
    case (101):
      h$regs[71] = h$regs[69];
    case (100):
      h$regs[70] = h$regs[68];
    case (99):
      h$regs[69] = h$regs[67];
    case (98):
      h$regs[68] = h$regs[66];
    case (97):
      h$regs[67] = h$regs[65];
    case (96):
      h$regs[66] = h$regs[64];
    case (95):
      h$regs[65] = h$regs[63];
    case (94):
      h$regs[64] = h$regs[62];
    case (93):
      h$regs[63] = h$regs[61];
    case (92):
      h$regs[62] = h$regs[60];
    case (91):
      h$regs[61] = h$regs[59];
    case (90):
      h$regs[60] = h$regs[58];
    case (89):
      h$regs[59] = h$regs[57];
    case (88):
      h$regs[58] = h$regs[56];
    case (87):
      h$regs[57] = h$regs[55];
    case (86):
      h$regs[56] = h$regs[54];
    case (85):
      h$regs[55] = h$regs[53];
    case (84):
      h$regs[54] = h$regs[52];
    case (83):
      h$regs[53] = h$regs[51];
    case (82):
      h$regs[52] = h$regs[50];
    case (81):
      h$regs[51] = h$regs[49];
    case (80):
      h$regs[50] = h$regs[48];
    case (79):
      h$regs[49] = h$regs[47];
    case (78):
      h$regs[48] = h$regs[46];
    case (77):
      h$regs[47] = h$regs[45];
    case (76):
      h$regs[46] = h$regs[44];
    case (75):
      h$regs[45] = h$regs[43];
    case (74):
      h$regs[44] = h$regs[42];
    case (73):
      h$regs[43] = h$regs[41];
    case (72):
      h$regs[42] = h$regs[40];
    case (71):
      h$regs[41] = h$regs[39];
    case (70):
      h$regs[40] = h$regs[38];
    case (69):
      h$regs[39] = h$regs[37];
    case (68):
      h$regs[38] = h$regs[36];
    case (67):
      h$regs[37] = h$regs[35];
    case (66):
      h$regs[36] = h$regs[34];
    case (65):
      h$regs[35] = h$regs[33];
    case (64):
      h$regs[34] = h$regs[32];
    case (63):
      h$regs[33] = h$regs[31];
    case (62):
      h$regs[32] = h$regs[30];
    case (61):
      h$regs[31] = h$regs[29];
    case (60):
      h$regs[30] = h$regs[28];
    case (59):
      h$regs[29] = h$regs[27];
    case (58):
      h$regs[28] = h$regs[26];
    case (57):
      h$regs[27] = h$regs[25];
    case (56):
      h$regs[26] = h$regs[24];
    case (55):
      h$regs[25] = h$regs[23];
    case (54):
      h$regs[24] = h$regs[22];
    case (53):
      h$regs[23] = h$regs[21];
    case (52):
      h$regs[22] = h$regs[20];
    case (51):
      h$regs[21] = h$regs[19];
    case (50):
      h$regs[20] = h$regs[18];
    case (49):
      h$regs[19] = h$regs[17];
    case (48):
      h$regs[18] = h$regs[16];
    case (47):
      h$regs[17] = h$regs[15];
    case (46):
      h$regs[16] = h$regs[14];
    case (45):
      h$regs[15] = h$regs[13];
    case (44):
      h$regs[14] = h$regs[12];
    case (43):
      h$regs[13] = h$regs[11];
    case (42):
      h$regs[12] = h$regs[10];
    case (41):
      h$regs[11] = h$regs[9];
    case (40):
      h$regs[10] = h$regs[8];
    case (39):
      h$regs[9] = h$regs[7];
    case (38):
      h$regs[8] = h$regs[6];
    case (37):
      h$regs[7] = h$regs[5];
    case (36):
      h$regs[6] = h$regs[4];
    case (35):
      h$regs[5] = h$regs[3];
    case (34):
      h$regs[4] = h$regs[2];
    case (33):
      h$regs[3] = h$regs[1];
    case (32):
      h$regs[2] = h$regs[0];
    case (31):
      h$regs[1] = h$r32;
    case (30):
      h$regs[0] = h$r31;
    case (29):
      h$r32 = h$r30;
    case (28):
      h$r31 = h$r29;
    case (27):
      h$r30 = h$r28;
    case (26):
      h$r29 = h$r27;
    case (25):
      h$r28 = h$r26;
    case (24):
      h$r27 = h$r25;
    case (23):
      h$r26 = h$r24;
    case (22):
      h$r25 = h$r23;
    case (21):
      h$r24 = h$r22;
    case (20):
      h$r23 = h$r21;
    case (19):
      h$r22 = h$r20;
    case (18):
      h$r21 = h$r19;
    case (17):
      h$r20 = h$r18;
    case (16):
      h$r19 = h$r17;
    case (15):
      h$r18 = h$r16;
    case (14):
      h$r17 = h$r15;
    case (13):
      h$r16 = h$r14;
    case (12):
      h$r15 = h$r13;
    case (11):
      h$r14 = h$r12;
    case (10):
      h$r13 = h$r11;
    case (9):
      h$r12 = h$r10;
    case (8):
      h$r11 = h$r9;
    case (7):
      h$r10 = h$r8;
    case (6):
      h$r9 = h$r7;
    case (5):
      h$r8 = h$r6;
    case (4):
      h$r7 = h$r5;
    case (3):
      h$r6 = h$r4;
    case (2):
      h$r5 = h$r3;
    case (1):
      h$r4 = h$r2;
    default:
  };
  h$r2 = h$RTS_502.d2;
  h$r3 = h$RTS_502.d3;
  h$r1 = h$RTS_501;
  return h$RTS_503;
};
h$o(h$pap_2, 3, 0, 4, (-1), null);
function h$pap_3()
{
  var h$RTS_505 = h$r1.d1;
  var h$RTS_506 = h$r1.d2;
  var h$RTS_507 = h$RTS_505.f;
  var h$RTS_508 = ((((h$RTS_507.t === 1) ? h$RTS_507.a : h$RTS_505.d2.d1) >> 8) - 3);
  switch (h$RTS_508)
  {
    case (124):
      h$regs[95] = h$regs[92];
    case (123):
      h$regs[94] = h$regs[91];
    case (122):
      h$regs[93] = h$regs[90];
    case (121):
      h$regs[92] = h$regs[89];
    case (120):
      h$regs[91] = h$regs[88];
    case (119):
      h$regs[90] = h$regs[87];
    case (118):
      h$regs[89] = h$regs[86];
    case (117):
      h$regs[88] = h$regs[85];
    case (116):
      h$regs[87] = h$regs[84];
    case (115):
      h$regs[86] = h$regs[83];
    case (114):
      h$regs[85] = h$regs[82];
    case (113):
      h$regs[84] = h$regs[81];
    case (112):
      h$regs[83] = h$regs[80];
    case (111):
      h$regs[82] = h$regs[79];
    case (110):
      h$regs[81] = h$regs[78];
    case (109):
      h$regs[80] = h$regs[77];
    case (108):
      h$regs[79] = h$regs[76];
    case (107):
      h$regs[78] = h$regs[75];
    case (106):
      h$regs[77] = h$regs[74];
    case (105):
      h$regs[76] = h$regs[73];
    case (104):
      h$regs[75] = h$regs[72];
    case (103):
      h$regs[74] = h$regs[71];
    case (102):
      h$regs[73] = h$regs[70];
    case (101):
      h$regs[72] = h$regs[69];
    case (100):
      h$regs[71] = h$regs[68];
    case (99):
      h$regs[70] = h$regs[67];
    case (98):
      h$regs[69] = h$regs[66];
    case (97):
      h$regs[68] = h$regs[65];
    case (96):
      h$regs[67] = h$regs[64];
    case (95):
      h$regs[66] = h$regs[63];
    case (94):
      h$regs[65] = h$regs[62];
    case (93):
      h$regs[64] = h$regs[61];
    case (92):
      h$regs[63] = h$regs[60];
    case (91):
      h$regs[62] = h$regs[59];
    case (90):
      h$regs[61] = h$regs[58];
    case (89):
      h$regs[60] = h$regs[57];
    case (88):
      h$regs[59] = h$regs[56];
    case (87):
      h$regs[58] = h$regs[55];
    case (86):
      h$regs[57] = h$regs[54];
    case (85):
      h$regs[56] = h$regs[53];
    case (84):
      h$regs[55] = h$regs[52];
    case (83):
      h$regs[54] = h$regs[51];
    case (82):
      h$regs[53] = h$regs[50];
    case (81):
      h$regs[52] = h$regs[49];
    case (80):
      h$regs[51] = h$regs[48];
    case (79):
      h$regs[50] = h$regs[47];
    case (78):
      h$regs[49] = h$regs[46];
    case (77):
      h$regs[48] = h$regs[45];
    case (76):
      h$regs[47] = h$regs[44];
    case (75):
      h$regs[46] = h$regs[43];
    case (74):
      h$regs[45] = h$regs[42];
    case (73):
      h$regs[44] = h$regs[41];
    case (72):
      h$regs[43] = h$regs[40];
    case (71):
      h$regs[42] = h$regs[39];
    case (70):
      h$regs[41] = h$regs[38];
    case (69):
      h$regs[40] = h$regs[37];
    case (68):
      h$regs[39] = h$regs[36];
    case (67):
      h$regs[38] = h$regs[35];
    case (66):
      h$regs[37] = h$regs[34];
    case (65):
      h$regs[36] = h$regs[33];
    case (64):
      h$regs[35] = h$regs[32];
    case (63):
      h$regs[34] = h$regs[31];
    case (62):
      h$regs[33] = h$regs[30];
    case (61):
      h$regs[32] = h$regs[29];
    case (60):
      h$regs[31] = h$regs[28];
    case (59):
      h$regs[30] = h$regs[27];
    case (58):
      h$regs[29] = h$regs[26];
    case (57):
      h$regs[28] = h$regs[25];
    case (56):
      h$regs[27] = h$regs[24];
    case (55):
      h$regs[26] = h$regs[23];
    case (54):
      h$regs[25] = h$regs[22];
    case (53):
      h$regs[24] = h$regs[21];
    case (52):
      h$regs[23] = h$regs[20];
    case (51):
      h$regs[22] = h$regs[19];
    case (50):
      h$regs[21] = h$regs[18];
    case (49):
      h$regs[20] = h$regs[17];
    case (48):
      h$regs[19] = h$regs[16];
    case (47):
      h$regs[18] = h$regs[15];
    case (46):
      h$regs[17] = h$regs[14];
    case (45):
      h$regs[16] = h$regs[13];
    case (44):
      h$regs[15] = h$regs[12];
    case (43):
      h$regs[14] = h$regs[11];
    case (42):
      h$regs[13] = h$regs[10];
    case (41):
      h$regs[12] = h$regs[9];
    case (40):
      h$regs[11] = h$regs[8];
    case (39):
      h$regs[10] = h$regs[7];
    case (38):
      h$regs[9] = h$regs[6];
    case (37):
      h$regs[8] = h$regs[5];
    case (36):
      h$regs[7] = h$regs[4];
    case (35):
      h$regs[6] = h$regs[3];
    case (34):
      h$regs[5] = h$regs[2];
    case (33):
      h$regs[4] = h$regs[1];
    case (32):
      h$regs[3] = h$regs[0];
    case (31):
      h$regs[2] = h$r32;
    case (30):
      h$regs[1] = h$r31;
    case (29):
      h$regs[0] = h$r30;
    case (28):
      h$r32 = h$r29;
    case (27):
      h$r31 = h$r28;
    case (26):
      h$r30 = h$r27;
    case (25):
      h$r29 = h$r26;
    case (24):
      h$r28 = h$r25;
    case (23):
      h$r27 = h$r24;
    case (22):
      h$r26 = h$r23;
    case (21):
      h$r25 = h$r22;
    case (20):
      h$r24 = h$r21;
    case (19):
      h$r23 = h$r20;
    case (18):
      h$r22 = h$r19;
    case (17):
      h$r21 = h$r18;
    case (16):
      h$r20 = h$r17;
    case (15):
      h$r19 = h$r16;
    case (14):
      h$r18 = h$r15;
    case (13):
      h$r17 = h$r14;
    case (12):
      h$r16 = h$r13;
    case (11):
      h$r15 = h$r12;
    case (10):
      h$r14 = h$r11;
    case (9):
      h$r13 = h$r10;
    case (8):
      h$r12 = h$r9;
    case (7):
      h$r11 = h$r8;
    case (6):
      h$r10 = h$r7;
    case (5):
      h$r9 = h$r6;
    case (4):
      h$r8 = h$r5;
    case (3):
      h$r7 = h$r4;
    case (2):
      h$r6 = h$r3;
    case (1):
      h$r5 = h$r2;
    default:
  };
  h$r2 = h$RTS_506.d2;
  h$r3 = h$RTS_506.d3;
  h$r4 = h$RTS_506.d4;
  h$r1 = h$RTS_505;
  return h$RTS_507;
};
h$o(h$pap_3, 3, 0, 5, (-1), null);
function h$pap_4()
{
  var h$RTS_509 = h$r1.d1;
  var h$RTS_510 = h$r1.d2;
  var h$RTS_511 = h$RTS_509.f;
  var h$RTS_512 = ((((h$RTS_511.t === 1) ? h$RTS_511.a : h$RTS_509.d2.d1) >> 8) - 4);
  switch (h$RTS_512)
  {
    case (123):
      h$regs[95] = h$regs[91];
    case (122):
      h$regs[94] = h$regs[90];
    case (121):
      h$regs[93] = h$regs[89];
    case (120):
      h$regs[92] = h$regs[88];
    case (119):
      h$regs[91] = h$regs[87];
    case (118):
      h$regs[90] = h$regs[86];
    case (117):
      h$regs[89] = h$regs[85];
    case (116):
      h$regs[88] = h$regs[84];
    case (115):
      h$regs[87] = h$regs[83];
    case (114):
      h$regs[86] = h$regs[82];
    case (113):
      h$regs[85] = h$regs[81];
    case (112):
      h$regs[84] = h$regs[80];
    case (111):
      h$regs[83] = h$regs[79];
    case (110):
      h$regs[82] = h$regs[78];
    case (109):
      h$regs[81] = h$regs[77];
    case (108):
      h$regs[80] = h$regs[76];
    case (107):
      h$regs[79] = h$regs[75];
    case (106):
      h$regs[78] = h$regs[74];
    case (105):
      h$regs[77] = h$regs[73];
    case (104):
      h$regs[76] = h$regs[72];
    case (103):
      h$regs[75] = h$regs[71];
    case (102):
      h$regs[74] = h$regs[70];
    case (101):
      h$regs[73] = h$regs[69];
    case (100):
      h$regs[72] = h$regs[68];
    case (99):
      h$regs[71] = h$regs[67];
    case (98):
      h$regs[70] = h$regs[66];
    case (97):
      h$regs[69] = h$regs[65];
    case (96):
      h$regs[68] = h$regs[64];
    case (95):
      h$regs[67] = h$regs[63];
    case (94):
      h$regs[66] = h$regs[62];
    case (93):
      h$regs[65] = h$regs[61];
    case (92):
      h$regs[64] = h$regs[60];
    case (91):
      h$regs[63] = h$regs[59];
    case (90):
      h$regs[62] = h$regs[58];
    case (89):
      h$regs[61] = h$regs[57];
    case (88):
      h$regs[60] = h$regs[56];
    case (87):
      h$regs[59] = h$regs[55];
    case (86):
      h$regs[58] = h$regs[54];
    case (85):
      h$regs[57] = h$regs[53];
    case (84):
      h$regs[56] = h$regs[52];
    case (83):
      h$regs[55] = h$regs[51];
    case (82):
      h$regs[54] = h$regs[50];
    case (81):
      h$regs[53] = h$regs[49];
    case (80):
      h$regs[52] = h$regs[48];
    case (79):
      h$regs[51] = h$regs[47];
    case (78):
      h$regs[50] = h$regs[46];
    case (77):
      h$regs[49] = h$regs[45];
    case (76):
      h$regs[48] = h$regs[44];
    case (75):
      h$regs[47] = h$regs[43];
    case (74):
      h$regs[46] = h$regs[42];
    case (73):
      h$regs[45] = h$regs[41];
    case (72):
      h$regs[44] = h$regs[40];
    case (71):
      h$regs[43] = h$regs[39];
    case (70):
      h$regs[42] = h$regs[38];
    case (69):
      h$regs[41] = h$regs[37];
    case (68):
      h$regs[40] = h$regs[36];
    case (67):
      h$regs[39] = h$regs[35];
    case (66):
      h$regs[38] = h$regs[34];
    case (65):
      h$regs[37] = h$regs[33];
    case (64):
      h$regs[36] = h$regs[32];
    case (63):
      h$regs[35] = h$regs[31];
    case (62):
      h$regs[34] = h$regs[30];
    case (61):
      h$regs[33] = h$regs[29];
    case (60):
      h$regs[32] = h$regs[28];
    case (59):
      h$regs[31] = h$regs[27];
    case (58):
      h$regs[30] = h$regs[26];
    case (57):
      h$regs[29] = h$regs[25];
    case (56):
      h$regs[28] = h$regs[24];
    case (55):
      h$regs[27] = h$regs[23];
    case (54):
      h$regs[26] = h$regs[22];
    case (53):
      h$regs[25] = h$regs[21];
    case (52):
      h$regs[24] = h$regs[20];
    case (51):
      h$regs[23] = h$regs[19];
    case (50):
      h$regs[22] = h$regs[18];
    case (49):
      h$regs[21] = h$regs[17];
    case (48):
      h$regs[20] = h$regs[16];
    case (47):
      h$regs[19] = h$regs[15];
    case (46):
      h$regs[18] = h$regs[14];
    case (45):
      h$regs[17] = h$regs[13];
    case (44):
      h$regs[16] = h$regs[12];
    case (43):
      h$regs[15] = h$regs[11];
    case (42):
      h$regs[14] = h$regs[10];
    case (41):
      h$regs[13] = h$regs[9];
    case (40):
      h$regs[12] = h$regs[8];
    case (39):
      h$regs[11] = h$regs[7];
    case (38):
      h$regs[10] = h$regs[6];
    case (37):
      h$regs[9] = h$regs[5];
    case (36):
      h$regs[8] = h$regs[4];
    case (35):
      h$regs[7] = h$regs[3];
    case (34):
      h$regs[6] = h$regs[2];
    case (33):
      h$regs[5] = h$regs[1];
    case (32):
      h$regs[4] = h$regs[0];
    case (31):
      h$regs[3] = h$r32;
    case (30):
      h$regs[2] = h$r31;
    case (29):
      h$regs[1] = h$r30;
    case (28):
      h$regs[0] = h$r29;
    case (27):
      h$r32 = h$r28;
    case (26):
      h$r31 = h$r27;
    case (25):
      h$r30 = h$r26;
    case (24):
      h$r29 = h$r25;
    case (23):
      h$r28 = h$r24;
    case (22):
      h$r27 = h$r23;
    case (21):
      h$r26 = h$r22;
    case (20):
      h$r25 = h$r21;
    case (19):
      h$r24 = h$r20;
    case (18):
      h$r23 = h$r19;
    case (17):
      h$r22 = h$r18;
    case (16):
      h$r21 = h$r17;
    case (15):
      h$r20 = h$r16;
    case (14):
      h$r19 = h$r15;
    case (13):
      h$r18 = h$r14;
    case (12):
      h$r17 = h$r13;
    case (11):
      h$r16 = h$r12;
    case (10):
      h$r15 = h$r11;
    case (9):
      h$r14 = h$r10;
    case (8):
      h$r13 = h$r9;
    case (7):
      h$r12 = h$r8;
    case (6):
      h$r11 = h$r7;
    case (5):
      h$r10 = h$r6;
    case (4):
      h$r9 = h$r5;
    case (3):
      h$r8 = h$r4;
    case (2):
      h$r7 = h$r3;
    case (1):
      h$r6 = h$r2;
    default:
  };
  h$r2 = h$RTS_510.d2;
  h$r3 = h$RTS_510.d3;
  h$r4 = h$RTS_510.d4;
  h$r5 = h$RTS_510.d5;
  h$r1 = h$RTS_509;
  return h$RTS_511;
};
h$o(h$pap_4, 3, 0, 6, (-1), null);
function h$pap_5()
{
  var h$RTS_513 = h$r1.d1;
  var h$RTS_514 = h$r1.d2;
  var h$RTS_515 = h$RTS_513.f;
  var h$RTS_516 = ((((h$RTS_515.t === 1) ? h$RTS_515.a : h$RTS_513.d2.d1) >> 8) - 5);
  switch (h$RTS_516)
  {
    case (122):
      h$regs[95] = h$regs[90];
    case (121):
      h$regs[94] = h$regs[89];
    case (120):
      h$regs[93] = h$regs[88];
    case (119):
      h$regs[92] = h$regs[87];
    case (118):
      h$regs[91] = h$regs[86];
    case (117):
      h$regs[90] = h$regs[85];
    case (116):
      h$regs[89] = h$regs[84];
    case (115):
      h$regs[88] = h$regs[83];
    case (114):
      h$regs[87] = h$regs[82];
    case (113):
      h$regs[86] = h$regs[81];
    case (112):
      h$regs[85] = h$regs[80];
    case (111):
      h$regs[84] = h$regs[79];
    case (110):
      h$regs[83] = h$regs[78];
    case (109):
      h$regs[82] = h$regs[77];
    case (108):
      h$regs[81] = h$regs[76];
    case (107):
      h$regs[80] = h$regs[75];
    case (106):
      h$regs[79] = h$regs[74];
    case (105):
      h$regs[78] = h$regs[73];
    case (104):
      h$regs[77] = h$regs[72];
    case (103):
      h$regs[76] = h$regs[71];
    case (102):
      h$regs[75] = h$regs[70];
    case (101):
      h$regs[74] = h$regs[69];
    case (100):
      h$regs[73] = h$regs[68];
    case (99):
      h$regs[72] = h$regs[67];
    case (98):
      h$regs[71] = h$regs[66];
    case (97):
      h$regs[70] = h$regs[65];
    case (96):
      h$regs[69] = h$regs[64];
    case (95):
      h$regs[68] = h$regs[63];
    case (94):
      h$regs[67] = h$regs[62];
    case (93):
      h$regs[66] = h$regs[61];
    case (92):
      h$regs[65] = h$regs[60];
    case (91):
      h$regs[64] = h$regs[59];
    case (90):
      h$regs[63] = h$regs[58];
    case (89):
      h$regs[62] = h$regs[57];
    case (88):
      h$regs[61] = h$regs[56];
    case (87):
      h$regs[60] = h$regs[55];
    case (86):
      h$regs[59] = h$regs[54];
    case (85):
      h$regs[58] = h$regs[53];
    case (84):
      h$regs[57] = h$regs[52];
    case (83):
      h$regs[56] = h$regs[51];
    case (82):
      h$regs[55] = h$regs[50];
    case (81):
      h$regs[54] = h$regs[49];
    case (80):
      h$regs[53] = h$regs[48];
    case (79):
      h$regs[52] = h$regs[47];
    case (78):
      h$regs[51] = h$regs[46];
    case (77):
      h$regs[50] = h$regs[45];
    case (76):
      h$regs[49] = h$regs[44];
    case (75):
      h$regs[48] = h$regs[43];
    case (74):
      h$regs[47] = h$regs[42];
    case (73):
      h$regs[46] = h$regs[41];
    case (72):
      h$regs[45] = h$regs[40];
    case (71):
      h$regs[44] = h$regs[39];
    case (70):
      h$regs[43] = h$regs[38];
    case (69):
      h$regs[42] = h$regs[37];
    case (68):
      h$regs[41] = h$regs[36];
    case (67):
      h$regs[40] = h$regs[35];
    case (66):
      h$regs[39] = h$regs[34];
    case (65):
      h$regs[38] = h$regs[33];
    case (64):
      h$regs[37] = h$regs[32];
    case (63):
      h$regs[36] = h$regs[31];
    case (62):
      h$regs[35] = h$regs[30];
    case (61):
      h$regs[34] = h$regs[29];
    case (60):
      h$regs[33] = h$regs[28];
    case (59):
      h$regs[32] = h$regs[27];
    case (58):
      h$regs[31] = h$regs[26];
    case (57):
      h$regs[30] = h$regs[25];
    case (56):
      h$regs[29] = h$regs[24];
    case (55):
      h$regs[28] = h$regs[23];
    case (54):
      h$regs[27] = h$regs[22];
    case (53):
      h$regs[26] = h$regs[21];
    case (52):
      h$regs[25] = h$regs[20];
    case (51):
      h$regs[24] = h$regs[19];
    case (50):
      h$regs[23] = h$regs[18];
    case (49):
      h$regs[22] = h$regs[17];
    case (48):
      h$regs[21] = h$regs[16];
    case (47):
      h$regs[20] = h$regs[15];
    case (46):
      h$regs[19] = h$regs[14];
    case (45):
      h$regs[18] = h$regs[13];
    case (44):
      h$regs[17] = h$regs[12];
    case (43):
      h$regs[16] = h$regs[11];
    case (42):
      h$regs[15] = h$regs[10];
    case (41):
      h$regs[14] = h$regs[9];
    case (40):
      h$regs[13] = h$regs[8];
    case (39):
      h$regs[12] = h$regs[7];
    case (38):
      h$regs[11] = h$regs[6];
    case (37):
      h$regs[10] = h$regs[5];
    case (36):
      h$regs[9] = h$regs[4];
    case (35):
      h$regs[8] = h$regs[3];
    case (34):
      h$regs[7] = h$regs[2];
    case (33):
      h$regs[6] = h$regs[1];
    case (32):
      h$regs[5] = h$regs[0];
    case (31):
      h$regs[4] = h$r32;
    case (30):
      h$regs[3] = h$r31;
    case (29):
      h$regs[2] = h$r30;
    case (28):
      h$regs[1] = h$r29;
    case (27):
      h$regs[0] = h$r28;
    case (26):
      h$r32 = h$r27;
    case (25):
      h$r31 = h$r26;
    case (24):
      h$r30 = h$r25;
    case (23):
      h$r29 = h$r24;
    case (22):
      h$r28 = h$r23;
    case (21):
      h$r27 = h$r22;
    case (20):
      h$r26 = h$r21;
    case (19):
      h$r25 = h$r20;
    case (18):
      h$r24 = h$r19;
    case (17):
      h$r23 = h$r18;
    case (16):
      h$r22 = h$r17;
    case (15):
      h$r21 = h$r16;
    case (14):
      h$r20 = h$r15;
    case (13):
      h$r19 = h$r14;
    case (12):
      h$r18 = h$r13;
    case (11):
      h$r17 = h$r12;
    case (10):
      h$r16 = h$r11;
    case (9):
      h$r15 = h$r10;
    case (8):
      h$r14 = h$r9;
    case (7):
      h$r13 = h$r8;
    case (6):
      h$r12 = h$r7;
    case (5):
      h$r11 = h$r6;
    case (4):
      h$r10 = h$r5;
    case (3):
      h$r9 = h$r4;
    case (2):
      h$r8 = h$r3;
    case (1):
      h$r7 = h$r2;
    default:
  };
  h$r2 = h$RTS_514.d2;
  h$r3 = h$RTS_514.d3;
  h$r4 = h$RTS_514.d4;
  h$r5 = h$RTS_514.d5;
  h$r6 = h$RTS_514.d6;
  h$r1 = h$RTS_513;
  return h$RTS_515;
};
h$o(h$pap_5, 3, 0, 7, (-1), null);
function h$pap_6()
{
  var h$RTS_517 = h$r1.d1;
  var h$RTS_518 = h$r1.d2;
  var h$RTS_519 = h$RTS_517.f;
  var h$RTS_520 = ((((h$RTS_519.t === 1) ? h$RTS_519.a : h$RTS_517.d2.d1) >> 8) - 6);
  switch (h$RTS_520)
  {
    case (121):
      h$regs[95] = h$regs[89];
    case (120):
      h$regs[94] = h$regs[88];
    case (119):
      h$regs[93] = h$regs[87];
    case (118):
      h$regs[92] = h$regs[86];
    case (117):
      h$regs[91] = h$regs[85];
    case (116):
      h$regs[90] = h$regs[84];
    case (115):
      h$regs[89] = h$regs[83];
    case (114):
      h$regs[88] = h$regs[82];
    case (113):
      h$regs[87] = h$regs[81];
    case (112):
      h$regs[86] = h$regs[80];
    case (111):
      h$regs[85] = h$regs[79];
    case (110):
      h$regs[84] = h$regs[78];
    case (109):
      h$regs[83] = h$regs[77];
    case (108):
      h$regs[82] = h$regs[76];
    case (107):
      h$regs[81] = h$regs[75];
    case (106):
      h$regs[80] = h$regs[74];
    case (105):
      h$regs[79] = h$regs[73];
    case (104):
      h$regs[78] = h$regs[72];
    case (103):
      h$regs[77] = h$regs[71];
    case (102):
      h$regs[76] = h$regs[70];
    case (101):
      h$regs[75] = h$regs[69];
    case (100):
      h$regs[74] = h$regs[68];
    case (99):
      h$regs[73] = h$regs[67];
    case (98):
      h$regs[72] = h$regs[66];
    case (97):
      h$regs[71] = h$regs[65];
    case (96):
      h$regs[70] = h$regs[64];
    case (95):
      h$regs[69] = h$regs[63];
    case (94):
      h$regs[68] = h$regs[62];
    case (93):
      h$regs[67] = h$regs[61];
    case (92):
      h$regs[66] = h$regs[60];
    case (91):
      h$regs[65] = h$regs[59];
    case (90):
      h$regs[64] = h$regs[58];
    case (89):
      h$regs[63] = h$regs[57];
    case (88):
      h$regs[62] = h$regs[56];
    case (87):
      h$regs[61] = h$regs[55];
    case (86):
      h$regs[60] = h$regs[54];
    case (85):
      h$regs[59] = h$regs[53];
    case (84):
      h$regs[58] = h$regs[52];
    case (83):
      h$regs[57] = h$regs[51];
    case (82):
      h$regs[56] = h$regs[50];
    case (81):
      h$regs[55] = h$regs[49];
    case (80):
      h$regs[54] = h$regs[48];
    case (79):
      h$regs[53] = h$regs[47];
    case (78):
      h$regs[52] = h$regs[46];
    case (77):
      h$regs[51] = h$regs[45];
    case (76):
      h$regs[50] = h$regs[44];
    case (75):
      h$regs[49] = h$regs[43];
    case (74):
      h$regs[48] = h$regs[42];
    case (73):
      h$regs[47] = h$regs[41];
    case (72):
      h$regs[46] = h$regs[40];
    case (71):
      h$regs[45] = h$regs[39];
    case (70):
      h$regs[44] = h$regs[38];
    case (69):
      h$regs[43] = h$regs[37];
    case (68):
      h$regs[42] = h$regs[36];
    case (67):
      h$regs[41] = h$regs[35];
    case (66):
      h$regs[40] = h$regs[34];
    case (65):
      h$regs[39] = h$regs[33];
    case (64):
      h$regs[38] = h$regs[32];
    case (63):
      h$regs[37] = h$regs[31];
    case (62):
      h$regs[36] = h$regs[30];
    case (61):
      h$regs[35] = h$regs[29];
    case (60):
      h$regs[34] = h$regs[28];
    case (59):
      h$regs[33] = h$regs[27];
    case (58):
      h$regs[32] = h$regs[26];
    case (57):
      h$regs[31] = h$regs[25];
    case (56):
      h$regs[30] = h$regs[24];
    case (55):
      h$regs[29] = h$regs[23];
    case (54):
      h$regs[28] = h$regs[22];
    case (53):
      h$regs[27] = h$regs[21];
    case (52):
      h$regs[26] = h$regs[20];
    case (51):
      h$regs[25] = h$regs[19];
    case (50):
      h$regs[24] = h$regs[18];
    case (49):
      h$regs[23] = h$regs[17];
    case (48):
      h$regs[22] = h$regs[16];
    case (47):
      h$regs[21] = h$regs[15];
    case (46):
      h$regs[20] = h$regs[14];
    case (45):
      h$regs[19] = h$regs[13];
    case (44):
      h$regs[18] = h$regs[12];
    case (43):
      h$regs[17] = h$regs[11];
    case (42):
      h$regs[16] = h$regs[10];
    case (41):
      h$regs[15] = h$regs[9];
    case (40):
      h$regs[14] = h$regs[8];
    case (39):
      h$regs[13] = h$regs[7];
    case (38):
      h$regs[12] = h$regs[6];
    case (37):
      h$regs[11] = h$regs[5];
    case (36):
      h$regs[10] = h$regs[4];
    case (35):
      h$regs[9] = h$regs[3];
    case (34):
      h$regs[8] = h$regs[2];
    case (33):
      h$regs[7] = h$regs[1];
    case (32):
      h$regs[6] = h$regs[0];
    case (31):
      h$regs[5] = h$r32;
    case (30):
      h$regs[4] = h$r31;
    case (29):
      h$regs[3] = h$r30;
    case (28):
      h$regs[2] = h$r29;
    case (27):
      h$regs[1] = h$r28;
    case (26):
      h$regs[0] = h$r27;
    case (25):
      h$r32 = h$r26;
    case (24):
      h$r31 = h$r25;
    case (23):
      h$r30 = h$r24;
    case (22):
      h$r29 = h$r23;
    case (21):
      h$r28 = h$r22;
    case (20):
      h$r27 = h$r21;
    case (19):
      h$r26 = h$r20;
    case (18):
      h$r25 = h$r19;
    case (17):
      h$r24 = h$r18;
    case (16):
      h$r23 = h$r17;
    case (15):
      h$r22 = h$r16;
    case (14):
      h$r21 = h$r15;
    case (13):
      h$r20 = h$r14;
    case (12):
      h$r19 = h$r13;
    case (11):
      h$r18 = h$r12;
    case (10):
      h$r17 = h$r11;
    case (9):
      h$r16 = h$r10;
    case (8):
      h$r15 = h$r9;
    case (7):
      h$r14 = h$r8;
    case (6):
      h$r13 = h$r7;
    case (5):
      h$r12 = h$r6;
    case (4):
      h$r11 = h$r5;
    case (3):
      h$r10 = h$r4;
    case (2):
      h$r9 = h$r3;
    case (1):
      h$r8 = h$r2;
    default:
  };
  h$r2 = h$RTS_518.d2;
  h$r3 = h$RTS_518.d3;
  h$r4 = h$RTS_518.d4;
  h$r5 = h$RTS_518.d5;
  h$r6 = h$RTS_518.d6;
  h$r7 = h$RTS_518.d7;
  h$r1 = h$RTS_517;
  return h$RTS_519;
};
h$o(h$pap_6, 3, 0, 8, (-1), null);
var h$apply = [];
var h$paps = [];
h$initStatic.push((function()
                   {
                     for(var h$RTS_521 = 0;(h$RTS_521 < 65536);(h$RTS_521++)) {
                       h$apply[h$RTS_521] = h$ap_gen;
                     };
                     for(h$RTS_521 = 0;(h$RTS_521 < 128);(h$RTS_521++)) {
                       h$paps[h$RTS_521] = h$pap_gen;
                     };
                     h$apply[0] = h$ap_0_0;
                     h$apply[1] = h$ap_1_0;
                     h$apply[1] = h$ap_1_0;
                     h$apply[257] = h$ap_1_1;
                     h$apply[513] = h$ap_1_2;
                     h$apply[258] = h$ap_2_1;
                     h$apply[514] = h$ap_2_2;
                     h$apply[770] = h$ap_2_3;
                     h$apply[1026] = h$ap_2_4;
                     h$apply[515] = h$ap_3_2;
                     h$apply[771] = h$ap_3_3;
                     h$apply[1027] = h$ap_3_4;
                     h$apply[1283] = h$ap_3_5;
                     h$apply[1539] = h$ap_3_6;
                     h$apply[772] = h$ap_4_3;
                     h$apply[1028] = h$ap_4_4;
                     h$apply[1284] = h$ap_4_5;
                     h$apply[1540] = h$ap_4_6;
                     h$apply[1796] = h$ap_4_7;
                     h$apply[2052] = h$ap_4_8;
                     h$paps[0] = h$pap_0;
                     h$paps[1] = h$pap_1;
                     h$paps[2] = h$pap_2;
                     h$paps[3] = h$pap_3;
                     h$paps[4] = h$pap_4;
                     h$paps[5] = h$pap_5;
                     h$paps[6] = h$pap_6;
                   }));
function h$ap_gen()
{
  var h$RTS_522 = h$r1.f;
  switch (h$RTS_522.t)
  {
    case (0):
      return h$RTS_522;
    case (1):
      var h$RTS_523 = h$stack[(h$sp - 1)];
      var h$RTS_524 = (h$RTS_522.a & 255);
      var h$RTS_525 = (h$RTS_523 & 255);
      var h$RTS_526 = (h$RTS_523 >> 8);
      if((h$RTS_525 === h$RTS_524))
      {
        for(var h$RTS_527 = 0;(h$RTS_527 < h$RTS_526);(h$RTS_527++)) {
          h$setReg((h$RTS_527 + 2), h$stack[((h$sp - 2) - h$RTS_527)]);
        };
        h$sp = ((h$sp - h$RTS_526) - 2);
        return h$RTS_522;
      }
      else
      {
        if((h$RTS_525 > h$RTS_524))
        {
          var h$RTS_528 = (h$RTS_522.a >> 8);
          for(var h$RTS_529 = 0;(h$RTS_529 < h$RTS_528);(h$RTS_529++)) {
            h$setReg((h$RTS_529 + 2), h$stack[((h$sp - 2) - h$RTS_529)]);
          };
          var h$RTS_530 = (((h$RTS_526 - h$RTS_528) << 8) | (h$RTS_525 - h$RTS_524));
          var h$RTS_531 = h$apply[h$RTS_530];
          if((h$RTS_531 === h$ap_gen))
          {
            h$sp -= h$RTS_528;
            h$stack[(h$sp - 1)] = h$RTS_530;
          }
          else
          {
            h$sp = ((h$sp - h$RTS_528) - 1);
          };
          h$stack[h$sp] = h$RTS_531;
          return h$RTS_522;
        }
        else
        {
          var h$RTS_532 = h$paps[h$RTS_526];
          var h$RTS_533 = [h$r1, (((((h$RTS_522.a >> 8) - h$RTS_526) * 256) + h$RTS_524) - h$RTS_525)];
          for(var h$RTS_534 = 0;(h$RTS_534 < h$RTS_526);(h$RTS_534++)) {
            h$RTS_533.push(h$stack[((h$sp - h$RTS_534) - 2)]);
          };
          h$sp = ((h$sp - h$RTS_526) - 2);
          h$r1 = h$init_closure({ d1: null, d2: null, f: h$RTS_532, m: 0
                                }, h$RTS_533);
          return h$rs();
        };
      };
    case (3):
      var h$RTS_535 = h$stack[(h$sp - 1)];
      var h$RTS_536 = (h$r1.d2.d1 & 255);
      var h$RTS_537 = (h$RTS_535 & 255);
      var h$RTS_538 = (h$RTS_535 >> 8);
      if((h$RTS_537 === h$RTS_536))
      {
        for(var h$RTS_539 = 0;(h$RTS_539 < h$RTS_538);(h$RTS_539++)) {
          h$setReg((h$RTS_539 + 2), h$stack[((h$sp - 2) - h$RTS_539)]);
        };
        h$sp = ((h$sp - h$RTS_538) - 2);
        return h$RTS_522;
      }
      else
      {
        if((h$RTS_537 > h$RTS_536))
        {
          var h$RTS_540 = (h$r1.d2.d1 >> 8);
          for(var h$RTS_541 = 0;(h$RTS_541 < h$RTS_540);(h$RTS_541++)) {
            h$setReg((h$RTS_541 + 2), h$stack[((h$sp - 2) - h$RTS_541)]);
          };
          var h$RTS_542 = (((h$RTS_538 - h$RTS_540) << 8) | (h$RTS_537 - h$RTS_536));
          var h$RTS_543 = h$apply[h$RTS_542];
          if((h$RTS_543 === h$ap_gen))
          {
            h$sp -= h$RTS_540;
            h$stack[(h$sp - 1)] = h$RTS_542;
          }
          else
          {
            h$sp = ((h$sp - h$RTS_540) - 1);
          };
          h$stack[h$sp] = h$RTS_543;
          return h$RTS_522;
        }
        else
        {
          var h$RTS_544 = h$paps[h$RTS_538];
          var h$RTS_545 = [h$r1, (((((h$r1.d2.d1 >> 8) - h$RTS_538) * 256) + h$RTS_536) - h$RTS_537)];
          for(var h$RTS_546 = 0;(h$RTS_546 < h$RTS_538);(h$RTS_546++)) {
            h$RTS_545.push(h$stack[((h$sp - h$RTS_546) - 2)]);
          };
          h$sp = ((h$sp - h$RTS_538) - 2);
          h$r1 = h$init_closure({ d1: null, d2: null, f: h$RTS_544, m: 0
                                }, h$RTS_545);
          return h$rs();
        };
      };
    case (5):
      h$p2(h$r1, h$return);
      return h$blockOnBlackhole(h$r1);
    default:
      throw(("h$ap_gen: unexpected closure type " + h$RTS_522.t));
  };
};
h$o(h$ap_gen, (-1), 0, (-1), 256, null);
function h$ap_gen_fast(h$RTS_547)
{
  var h$RTS_548 = h$r1.f;
  switch (h$RTS_548.t)
  {
    case (0):
      var h$RTS_549 = (h$RTS_547 >> 8);
      h$sp += h$RTS_549;
      switch (h$RTS_549)
      {
        case (64):
          h$stack[(h$sp - 63)] = h$regs[32];
        case (63):
          h$stack[(h$sp - 62)] = h$regs[31];
        case (62):
          h$stack[(h$sp - 61)] = h$regs[30];
        case (61):
          h$stack[(h$sp - 60)] = h$regs[29];
        case (60):
          h$stack[(h$sp - 59)] = h$regs[28];
        case (59):
          h$stack[(h$sp - 58)] = h$regs[27];
        case (58):
          h$stack[(h$sp - 57)] = h$regs[26];
        case (57):
          h$stack[(h$sp - 56)] = h$regs[25];
        case (56):
          h$stack[(h$sp - 55)] = h$regs[24];
        case (55):
          h$stack[(h$sp - 54)] = h$regs[23];
        case (54):
          h$stack[(h$sp - 53)] = h$regs[22];
        case (53):
          h$stack[(h$sp - 52)] = h$regs[21];
        case (52):
          h$stack[(h$sp - 51)] = h$regs[20];
        case (51):
          h$stack[(h$sp - 50)] = h$regs[19];
        case (50):
          h$stack[(h$sp - 49)] = h$regs[18];
        case (49):
          h$stack[(h$sp - 48)] = h$regs[17];
        case (48):
          h$stack[(h$sp - 47)] = h$regs[16];
        case (47):
          h$stack[(h$sp - 46)] = h$regs[15];
        case (46):
          h$stack[(h$sp - 45)] = h$regs[14];
        case (45):
          h$stack[(h$sp - 44)] = h$regs[13];
        case (44):
          h$stack[(h$sp - 43)] = h$regs[12];
        case (43):
          h$stack[(h$sp - 42)] = h$regs[11];
        case (42):
          h$stack[(h$sp - 41)] = h$regs[10];
        case (41):
          h$stack[(h$sp - 40)] = h$regs[9];
        case (40):
          h$stack[(h$sp - 39)] = h$regs[8];
        case (39):
          h$stack[(h$sp - 38)] = h$regs[7];
        case (38):
          h$stack[(h$sp - 37)] = h$regs[6];
        case (37):
          h$stack[(h$sp - 36)] = h$regs[5];
        case (36):
          h$stack[(h$sp - 35)] = h$regs[4];
        case (35):
          h$stack[(h$sp - 34)] = h$regs[3];
        case (34):
          h$stack[(h$sp - 33)] = h$regs[2];
        case (33):
          h$stack[(h$sp - 32)] = h$regs[1];
        case (32):
          h$stack[(h$sp - 31)] = h$regs[0];
        case (31):
          h$stack[(h$sp - 30)] = h$r32;
        case (30):
          h$stack[(h$sp - 29)] = h$r31;
        case (29):
          h$stack[(h$sp - 28)] = h$r30;
        case (28):
          h$stack[(h$sp - 27)] = h$r29;
        case (27):
          h$stack[(h$sp - 26)] = h$r28;
        case (26):
          h$stack[(h$sp - 25)] = h$r27;
        case (25):
          h$stack[(h$sp - 24)] = h$r26;
        case (24):
          h$stack[(h$sp - 23)] = h$r25;
        case (23):
          h$stack[(h$sp - 22)] = h$r24;
        case (22):
          h$stack[(h$sp - 21)] = h$r23;
        case (21):
          h$stack[(h$sp - 20)] = h$r22;
        case (20):
          h$stack[(h$sp - 19)] = h$r21;
        case (19):
          h$stack[(h$sp - 18)] = h$r20;
        case (18):
          h$stack[(h$sp - 17)] = h$r19;
        case (17):
          h$stack[(h$sp - 16)] = h$r18;
        case (16):
          h$stack[(h$sp - 15)] = h$r17;
        case (15):
          h$stack[(h$sp - 14)] = h$r16;
        case (14):
          h$stack[(h$sp - 13)] = h$r15;
        case (13):
          h$stack[(h$sp - 12)] = h$r14;
        case (12):
          h$stack[(h$sp - 11)] = h$r13;
        case (11):
          h$stack[(h$sp - 10)] = h$r12;
        case (10):
          h$stack[(h$sp - 9)] = h$r11;
        case (9):
          h$stack[(h$sp - 8)] = h$r10;
        case (8):
          h$stack[(h$sp - 7)] = h$r9;
        case (7):
          h$stack[(h$sp - 6)] = h$r8;
        case (6):
          h$stack[(h$sp - 5)] = h$r7;
        case (5):
          h$stack[(h$sp - 4)] = h$r6;
        case (4):
          h$stack[(h$sp - 3)] = h$r5;
        case (3):
          h$stack[(h$sp - 2)] = h$r4;
        case (2):
          h$stack[(h$sp - 1)] = h$r3;
        case (1):
          h$stack[(h$sp - 0)] = h$r2;
        default:
      };
      var h$RTS_550 = h$apply[h$RTS_547];
      if((h$RTS_550 === h$ap_gen))
      {
        h$sp += 2;
        h$stack[(h$sp - 1)] = h$RTS_547;
      }
      else
      {
        ++h$sp;
      };
      h$stack[h$sp] = h$RTS_550;
      return h$RTS_548;
    case (1):
      var h$RTS_551 = h$RTS_548.a;
      var h$RTS_552 = (h$RTS_551 & 255);
      var h$RTS_553 = (h$RTS_547 & 255);
      var h$RTS_554 = (h$RTS_547 >> 8);
      if((h$RTS_553 === h$RTS_552))
      {
        return h$RTS_548;
      }
      else
      {
        if((h$RTS_553 > h$RTS_552))
        {
          var h$RTS_555 = ((h$RTS_551 >> 8) + 1);
          h$sp = (((h$sp + h$RTS_554) - h$RTS_555) + 1);
          for(var h$RTS_556 = h$RTS_554;(h$RTS_556 >= h$RTS_555);(h$RTS_556--)) {
            h$stack[((h$sp + h$RTS_555) - h$RTS_556)] = h$getReg((h$RTS_556 + 1));
          };
          var h$RTS_557 = (((h$RTS_554 - (h$RTS_551 >> 8)) << 8) | (h$RTS_553 - h$RTS_552));
          var h$RTS_558 = h$apply[h$RTS_557];
          if((h$RTS_558 === h$ap_gen))
          {
            h$sp += 2;
            h$stack[(h$sp - 1)] = h$RTS_557;
          }
          else
          {
            ++h$sp;
          };
          h$stack[h$sp] = h$RTS_558;
          return h$RTS_548;
        }
        else
        {
          if((h$RTS_547 != 0))
          {
            var h$RTS_559 = h$paps[h$RTS_554];
            var h$RTS_560 = [h$r1, (((((h$RTS_551 >> 8) - h$RTS_554) * 256) + h$RTS_552) - h$RTS_553)];
            for(var h$RTS_561 = 0;(h$RTS_561 < h$RTS_554);(h$RTS_561++)) {
              h$RTS_560.push(h$getReg((h$RTS_561 + 2)));
            };
            h$r1 = h$init_closure({ d1: null, d2: null, f: h$RTS_559, m: 0
                                  }, h$RTS_560);
          };
          return h$rs();
        };
      };
    case (3):
      var h$RTS_562 = h$r1.d2.d1;
      var h$RTS_563 = (h$RTS_562 & 255);
      var h$RTS_564 = (h$RTS_547 & 255);
      var h$RTS_565 = (h$RTS_547 >> 8);
      if((h$RTS_564 === h$RTS_563))
      {
        return h$RTS_548;
      }
      else
      {
        if((h$RTS_564 > h$RTS_563))
        {
          var h$RTS_566 = ((h$RTS_562 >> 8) + 1);
          h$sp = (((h$sp + h$RTS_565) - h$RTS_566) + 1);
          for(var h$RTS_567 = h$RTS_565;(h$RTS_567 >= h$RTS_566);(h$RTS_567--)) {
            h$stack[((h$sp + h$RTS_566) - h$RTS_567)] = h$getReg((h$RTS_567 + 1));
          };
          var h$RTS_568 = (((h$RTS_565 - (h$RTS_562 >> 8)) << 8) | (h$RTS_564 - h$RTS_563));
          var h$RTS_569 = h$apply[h$RTS_568];
          if((h$RTS_569 === h$ap_gen))
          {
            h$sp += 2;
            h$stack[(h$sp - 1)] = h$RTS_568;
          }
          else
          {
            ++h$sp;
          };
          h$stack[h$sp] = h$RTS_569;
          return h$RTS_548;
        }
        else
        {
          if((h$RTS_547 != 0))
          {
            var h$RTS_570 = h$paps[h$RTS_565];
            var h$RTS_571 = [h$r1, (((((h$RTS_562 >> 8) - h$RTS_565) * 256) + h$RTS_563) - h$RTS_564)];
            for(var h$RTS_572 = 0;(h$RTS_572 < h$RTS_565);(h$RTS_572++)) {
              h$RTS_571.push(h$getReg((h$RTS_572 + 2)));
            };
            h$r1 = h$init_closure({ d1: null, d2: null, f: h$RTS_570, m: 0
                                  }, h$RTS_571);
          };
          return h$rs();
        };
      };
    case (2):
      if((h$RTS_547 != 0))
      {
        throw("h$ap_gen_fast: invalid apply");
      };
      return h$RTS_548;
    case (5):
      var h$RTS_573 = (h$RTS_547 >> 8);
      h$sp += h$RTS_573;
      switch (h$RTS_573)
      {
        case (64):
          h$stack[(h$sp - 63)] = h$regs[32];
        case (63):
          h$stack[(h$sp - 62)] = h$regs[31];
        case (62):
          h$stack[(h$sp - 61)] = h$regs[30];
        case (61):
          h$stack[(h$sp - 60)] = h$regs[29];
        case (60):
          h$stack[(h$sp - 59)] = h$regs[28];
        case (59):
          h$stack[(h$sp - 58)] = h$regs[27];
        case (58):
          h$stack[(h$sp - 57)] = h$regs[26];
        case (57):
          h$stack[(h$sp - 56)] = h$regs[25];
        case (56):
          h$stack[(h$sp - 55)] = h$regs[24];
        case (55):
          h$stack[(h$sp - 54)] = h$regs[23];
        case (54):
          h$stack[(h$sp - 53)] = h$regs[22];
        case (53):
          h$stack[(h$sp - 52)] = h$regs[21];
        case (52):
          h$stack[(h$sp - 51)] = h$regs[20];
        case (51):
          h$stack[(h$sp - 50)] = h$regs[19];
        case (50):
          h$stack[(h$sp - 49)] = h$regs[18];
        case (49):
          h$stack[(h$sp - 48)] = h$regs[17];
        case (48):
          h$stack[(h$sp - 47)] = h$regs[16];
        case (47):
          h$stack[(h$sp - 46)] = h$regs[15];
        case (46):
          h$stack[(h$sp - 45)] = h$regs[14];
        case (45):
          h$stack[(h$sp - 44)] = h$regs[13];
        case (44):
          h$stack[(h$sp - 43)] = h$regs[12];
        case (43):
          h$stack[(h$sp - 42)] = h$regs[11];
        case (42):
          h$stack[(h$sp - 41)] = h$regs[10];
        case (41):
          h$stack[(h$sp - 40)] = h$regs[9];
        case (40):
          h$stack[(h$sp - 39)] = h$regs[8];
        case (39):
          h$stack[(h$sp - 38)] = h$regs[7];
        case (38):
          h$stack[(h$sp - 37)] = h$regs[6];
        case (37):
          h$stack[(h$sp - 36)] = h$regs[5];
        case (36):
          h$stack[(h$sp - 35)] = h$regs[4];
        case (35):
          h$stack[(h$sp - 34)] = h$regs[3];
        case (34):
          h$stack[(h$sp - 33)] = h$regs[2];
        case (33):
          h$stack[(h$sp - 32)] = h$regs[1];
        case (32):
          h$stack[(h$sp - 31)] = h$regs[0];
        case (31):
          h$stack[(h$sp - 30)] = h$r32;
        case (30):
          h$stack[(h$sp - 29)] = h$r31;
        case (29):
          h$stack[(h$sp - 28)] = h$r30;
        case (28):
          h$stack[(h$sp - 27)] = h$r29;
        case (27):
          h$stack[(h$sp - 26)] = h$r28;
        case (26):
          h$stack[(h$sp - 25)] = h$r27;
        case (25):
          h$stack[(h$sp - 24)] = h$r26;
        case (24):
          h$stack[(h$sp - 23)] = h$r25;
        case (23):
          h$stack[(h$sp - 22)] = h$r24;
        case (22):
          h$stack[(h$sp - 21)] = h$r23;
        case (21):
          h$stack[(h$sp - 20)] = h$r22;
        case (20):
          h$stack[(h$sp - 19)] = h$r21;
        case (19):
          h$stack[(h$sp - 18)] = h$r20;
        case (18):
          h$stack[(h$sp - 17)] = h$r19;
        case (17):
          h$stack[(h$sp - 16)] = h$r18;
        case (16):
          h$stack[(h$sp - 15)] = h$r17;
        case (15):
          h$stack[(h$sp - 14)] = h$r16;
        case (14):
          h$stack[(h$sp - 13)] = h$r15;
        case (13):
          h$stack[(h$sp - 12)] = h$r14;
        case (12):
          h$stack[(h$sp - 11)] = h$r13;
        case (11):
          h$stack[(h$sp - 10)] = h$r12;
        case (10):
          h$stack[(h$sp - 9)] = h$r11;
        case (9):
          h$stack[(h$sp - 8)] = h$r10;
        case (8):
          h$stack[(h$sp - 7)] = h$r9;
        case (7):
          h$stack[(h$sp - 6)] = h$r8;
        case (6):
          h$stack[(h$sp - 5)] = h$r7;
        case (5):
          h$stack[(h$sp - 4)] = h$r6;
        case (4):
          h$stack[(h$sp - 3)] = h$r5;
        case (3):
          h$stack[(h$sp - 2)] = h$r4;
        case (2):
          h$stack[(h$sp - 1)] = h$r3;
        case (1):
          h$stack[(h$sp - 0)] = h$r2;
        default:
      };
      var h$RTS_574 = h$apply[h$RTS_547];
      if((h$RTS_574 === h$ap_gen))
      {
        h$sp += 2;
        h$stack[(h$sp - 1)] = h$RTS_547;
      }
      else
      {
        ++h$sp;
      };
      h$stack[h$sp] = h$RTS_574;
      h$p2(h$r1, h$return);
      return h$blockOnBlackhole(h$r1);
    default:
      throw(("h$ap_gen_fast: unexpected closure type: " + h$RTS_548.t));
  };
};
function h$ap_0_0_fast()
{
  if((typeof h$r1 !== "object"))
  {
    return h$rs();
  };
  var h$RTS_575 = h$r1.f;
  if((h$RTS_575 === h$unbox_e))
  {
    h$r1 = h$r1.d1;
    return h$rs();
  };
  switch (h$RTS_575.t)
  {
    case (2):
    case (1):
    case (3):
      return h$rs();
    case (5):
      h$p3(h$ap_0_0, h$r1, h$return);
      return h$blockOnBlackhole(h$r1);
    default:
      return h$RTS_575;
  };
};
function h$ap_0_0()
{
  --h$sp;
  if((typeof h$r1 !== "object"))
  {
    return h$rs();
  };
  var h$RTS_576 = h$r1.f;
  if((h$RTS_576 === h$unbox_e))
  {
    h$r1 = h$r1.d1;
    return h$rs();
  };
  switch (h$RTS_576.t)
  {
    case (2):
    case (1):
    case (3):
      return h$rs();
    case (5):
      h$p3(h$ap_0_0, h$r1, h$return);
      return h$blockOnBlackhole(h$r1);
    default:
      return h$RTS_576;
  };
};
h$o(h$ap_0_0, (-1), 0, 0, 256, null);
function h$ap_1_0(h$RTS_577)
{
  var h$RTS_578 = h$r1.f;
  if((h$RTS_578.t === 0))
  {
    return h$RTS_578;
  }
  else
  {
    if((h$RTS_578.t === 5))
    {
      h$p2(h$r1, h$return);
      return h$blockOnBlackhole(h$r1);
    }
    else
    {
      --h$sp;
      return h$RTS_578;
    };
  };
};
h$o(h$ap_1_0, (-1), 0, 0, 256, null);
function h$e(h$RTS_579)
{
  h$r1 = h$RTS_579;
  if((typeof h$RTS_579 !== "object"))
  {
    return h$rs();
  };
  var h$RTS_580 = h$RTS_579.f;
  if((h$RTS_580 === h$unbox_e))
  {
    h$r1 = h$RTS_579.d1;
    return h$rs();
  };
  switch (h$RTS_580.t)
  {
    case (2):
    case (1):
    case (3):
      return h$rs();
    case (5):
      h$p3(h$ap_0_0, h$RTS_579, h$return);
      return h$blockOnBlackhole(h$RTS_579);
    default:
      return h$RTS_580;
  };
};
function h$upd_frame()
{
  var h$RTS_581 = h$stack[(h$sp - 1)];
  var h$RTS_582 = h$RTS_581.d2;
  if((h$RTS_582 !== null))
  {
    for(var h$RTS_583 = 0;(h$RTS_583 < h$RTS_582.length);(h$RTS_583++)) {
      h$wakeupThread(h$RTS_582[h$RTS_583]);
    };
  };
  if((typeof h$r1 === "object"))
  {
    h$RTS_581.f = h$r1.f;
    h$RTS_581.d1 = h$r1.d1;
    h$RTS_581.d2 = h$r1.d2;
    h$RTS_581.m = h$r1.m;
  }
  else
  {
    h$RTS_581.f = h$unbox_e;
    h$RTS_581.d1 = h$r1;
    h$RTS_581.d2 = null;
    h$RTS_581.m = 0;
  };
  h$sp -= 2;
  return h$rs();
};
h$o(h$upd_frame, (-1), 0, 1, 256, null);
function h$upd_frame_lne()
{
  var h$RTS_584 = h$stack[(h$sp - 1)];
  h$stack[h$RTS_584] = h$r1;
  h$sp -= 2;
  return h$rs();
};
h$o(h$upd_frame_lne, (-1), 0, 1, 256, null);
function h$pap_gen()
{
  var h$RTS_585 = h$r1.d1;
  var h$RTS_586 = h$RTS_585.f;
  var h$RTS_587 = h$r1.d2;
  var h$RTS_588 = (((h$RTS_586.t === 1) ? h$RTS_586.a : h$RTS_585.d2.d1) >> 8);
  var h$RTS_589 = (h$r1.d2.d1 >> 8);
  var h$RTS_590 = (h$RTS_588 - h$RTS_589);
  h$moveRegs2(h$RTS_589, h$RTS_590);
  switch (h$RTS_590)
  {
    case (127):
      h$regs[95] = h$RTS_587.d128;
    case (126):
      h$regs[94] = h$RTS_587.d127;
    case (125):
      h$regs[93] = h$RTS_587.d126;
    case (124):
      h$regs[92] = h$RTS_587.d125;
    case (123):
      h$regs[91] = h$RTS_587.d124;
    case (122):
      h$regs[90] = h$RTS_587.d123;
    case (121):
      h$regs[89] = h$RTS_587.d122;
    case (120):
      h$regs[88] = h$RTS_587.d121;
    case (119):
      h$regs[87] = h$RTS_587.d120;
    case (118):
      h$regs[86] = h$RTS_587.d119;
    case (117):
      h$regs[85] = h$RTS_587.d118;
    case (116):
      h$regs[84] = h$RTS_587.d117;
    case (115):
      h$regs[83] = h$RTS_587.d116;
    case (114):
      h$regs[82] = h$RTS_587.d115;
    case (113):
      h$regs[81] = h$RTS_587.d114;
    case (112):
      h$regs[80] = h$RTS_587.d113;
    case (111):
      h$regs[79] = h$RTS_587.d112;
    case (110):
      h$regs[78] = h$RTS_587.d111;
    case (109):
      h$regs[77] = h$RTS_587.d110;
    case (108):
      h$regs[76] = h$RTS_587.d109;
    case (107):
      h$regs[75] = h$RTS_587.d108;
    case (106):
      h$regs[74] = h$RTS_587.d107;
    case (105):
      h$regs[73] = h$RTS_587.d106;
    case (104):
      h$regs[72] = h$RTS_587.d105;
    case (103):
      h$regs[71] = h$RTS_587.d104;
    case (102):
      h$regs[70] = h$RTS_587.d103;
    case (101):
      h$regs[69] = h$RTS_587.d102;
    case (100):
      h$regs[68] = h$RTS_587.d101;
    case (99):
      h$regs[67] = h$RTS_587.d100;
    case (98):
      h$regs[66] = h$RTS_587.d99;
    case (97):
      h$regs[65] = h$RTS_587.d98;
    case (96):
      h$regs[64] = h$RTS_587.d97;
    case (95):
      h$regs[63] = h$RTS_587.d96;
    case (94):
      h$regs[62] = h$RTS_587.d95;
    case (93):
      h$regs[61] = h$RTS_587.d94;
    case (92):
      h$regs[60] = h$RTS_587.d93;
    case (91):
      h$regs[59] = h$RTS_587.d92;
    case (90):
      h$regs[58] = h$RTS_587.d91;
    case (89):
      h$regs[57] = h$RTS_587.d90;
    case (88):
      h$regs[56] = h$RTS_587.d89;
    case (87):
      h$regs[55] = h$RTS_587.d88;
    case (86):
      h$regs[54] = h$RTS_587.d87;
    case (85):
      h$regs[53] = h$RTS_587.d86;
    case (84):
      h$regs[52] = h$RTS_587.d85;
    case (83):
      h$regs[51] = h$RTS_587.d84;
    case (82):
      h$regs[50] = h$RTS_587.d83;
    case (81):
      h$regs[49] = h$RTS_587.d82;
    case (80):
      h$regs[48] = h$RTS_587.d81;
    case (79):
      h$regs[47] = h$RTS_587.d80;
    case (78):
      h$regs[46] = h$RTS_587.d79;
    case (77):
      h$regs[45] = h$RTS_587.d78;
    case (76):
      h$regs[44] = h$RTS_587.d77;
    case (75):
      h$regs[43] = h$RTS_587.d76;
    case (74):
      h$regs[42] = h$RTS_587.d75;
    case (73):
      h$regs[41] = h$RTS_587.d74;
    case (72):
      h$regs[40] = h$RTS_587.d73;
    case (71):
      h$regs[39] = h$RTS_587.d72;
    case (70):
      h$regs[38] = h$RTS_587.d71;
    case (69):
      h$regs[37] = h$RTS_587.d70;
    case (68):
      h$regs[36] = h$RTS_587.d69;
    case (67):
      h$regs[35] = h$RTS_587.d68;
    case (66):
      h$regs[34] = h$RTS_587.d67;
    case (65):
      h$regs[33] = h$RTS_587.d66;
    case (64):
      h$regs[32] = h$RTS_587.d65;
    case (63):
      h$regs[31] = h$RTS_587.d64;
    case (62):
      h$regs[30] = h$RTS_587.d63;
    case (61):
      h$regs[29] = h$RTS_587.d62;
    case (60):
      h$regs[28] = h$RTS_587.d61;
    case (59):
      h$regs[27] = h$RTS_587.d60;
    case (58):
      h$regs[26] = h$RTS_587.d59;
    case (57):
      h$regs[25] = h$RTS_587.d58;
    case (56):
      h$regs[24] = h$RTS_587.d57;
    case (55):
      h$regs[23] = h$RTS_587.d56;
    case (54):
      h$regs[22] = h$RTS_587.d55;
    case (53):
      h$regs[21] = h$RTS_587.d54;
    case (52):
      h$regs[20] = h$RTS_587.d53;
    case (51):
      h$regs[19] = h$RTS_587.d52;
    case (50):
      h$regs[18] = h$RTS_587.d51;
    case (49):
      h$regs[17] = h$RTS_587.d50;
    case (48):
      h$regs[16] = h$RTS_587.d49;
    case (47):
      h$regs[15] = h$RTS_587.d48;
    case (46):
      h$regs[14] = h$RTS_587.d47;
    case (45):
      h$regs[13] = h$RTS_587.d46;
    case (44):
      h$regs[12] = h$RTS_587.d45;
    case (43):
      h$regs[11] = h$RTS_587.d44;
    case (42):
      h$regs[10] = h$RTS_587.d43;
    case (41):
      h$regs[9] = h$RTS_587.d42;
    case (40):
      h$regs[8] = h$RTS_587.d41;
    case (39):
      h$regs[7] = h$RTS_587.d40;
    case (38):
      h$regs[6] = h$RTS_587.d39;
    case (37):
      h$regs[5] = h$RTS_587.d38;
    case (36):
      h$regs[4] = h$RTS_587.d37;
    case (35):
      h$regs[3] = h$RTS_587.d36;
    case (34):
      h$regs[2] = h$RTS_587.d35;
    case (33):
      h$regs[1] = h$RTS_587.d34;
    case (32):
      h$regs[0] = h$RTS_587.d33;
    case (31):
      h$r32 = h$RTS_587.d32;
    case (30):
      h$r31 = h$RTS_587.d31;
    case (29):
      h$r30 = h$RTS_587.d30;
    case (28):
      h$r29 = h$RTS_587.d29;
    case (27):
      h$r28 = h$RTS_587.d28;
    case (26):
      h$r27 = h$RTS_587.d27;
    case (25):
      h$r26 = h$RTS_587.d26;
    case (24):
      h$r25 = h$RTS_587.d25;
    case (23):
      h$r24 = h$RTS_587.d24;
    case (22):
      h$r23 = h$RTS_587.d23;
    case (21):
      h$r22 = h$RTS_587.d22;
    case (20):
      h$r21 = h$RTS_587.d21;
    case (19):
      h$r20 = h$RTS_587.d20;
    case (18):
      h$r19 = h$RTS_587.d19;
    case (17):
      h$r18 = h$RTS_587.d18;
    case (16):
      h$r17 = h$RTS_587.d17;
    case (15):
      h$r16 = h$RTS_587.d16;
    case (14):
      h$r15 = h$RTS_587.d15;
    case (13):
      h$r14 = h$RTS_587.d14;
    case (12):
      h$r13 = h$RTS_587.d13;
    case (11):
      h$r12 = h$RTS_587.d12;
    case (10):
      h$r11 = h$RTS_587.d11;
    case (9):
      h$r10 = h$RTS_587.d10;
    case (8):
      h$r9 = h$RTS_587.d9;
    case (7):
      h$r8 = h$RTS_587.d8;
    case (6):
      h$r7 = h$RTS_587.d7;
    case (5):
      h$r6 = h$RTS_587.d6;
    case (4):
      h$r5 = h$RTS_587.d5;
    case (3):
      h$r4 = h$RTS_587.d4;
    case (2):
      h$r3 = h$RTS_587.d3;
    case (1):
      h$r2 = h$RTS_587.d2;
    default:
  };
  h$r1 = h$RTS_585;
  return h$RTS_586;
};
h$o(h$pap_gen, 3, 0, (-1), (-1), null);
function h$moveRegs2(h$RTS_591, h$RTS_592)
{
  switch (((h$RTS_591 << 8) | h$RTS_592))
  {
    case (257):
      h$r3 = h$r2;
      break;
    case (258):
      h$r4 = h$r2;
      break;
    case (259):
      h$r5 = h$r2;
      break;
    case (260):
      h$r6 = h$r2;
      break;
    case (513):
      h$r4 = h$r3;
      h$r3 = h$r2;
      break;
    case (514):
      h$r5 = h$r3;
      h$r4 = h$r2;
      break;
    case (515):
      h$r6 = h$r3;
      h$r5 = h$r2;
      break;
    case (516):
      h$r7 = h$r3;
      h$r6 = h$r2;
      break;
    case (769):
      h$r5 = h$r4;
      h$r4 = h$r3;
      h$r3 = h$r2;
      break;
    case (770):
      h$r6 = h$r4;
      h$r5 = h$r3;
      h$r4 = h$r2;
      break;
    case (771):
      h$r7 = h$r4;
      h$r6 = h$r3;
      h$r5 = h$r2;
      break;
    case (772):
      h$r8 = h$r4;
      h$r7 = h$r3;
      h$r6 = h$r2;
      break;
    case (1025):
      h$r6 = h$r5;
      h$r5 = h$r4;
      h$r4 = h$r3;
      h$r3 = h$r2;
      break;
    case (1026):
      h$r7 = h$r5;
      h$r6 = h$r4;
      h$r5 = h$r3;
      h$r4 = h$r2;
      break;
    case (1027):
      h$r8 = h$r5;
      h$r7 = h$r4;
      h$r6 = h$r3;
      h$r5 = h$r2;
      break;
    case (1028):
      h$r9 = h$r5;
      h$r8 = h$r4;
      h$r7 = h$r3;
      h$r6 = h$r2;
      break;
    case (1281):
      h$r7 = h$r6;
      h$r6 = h$r5;
      h$r5 = h$r4;
      h$r4 = h$r3;
      h$r3 = h$r2;
      break;
    case (1282):
      h$r8 = h$r6;
      h$r7 = h$r5;
      h$r6 = h$r4;
      h$r5 = h$r3;
      h$r4 = h$r2;
      break;
    case (1283):
      h$r9 = h$r6;
      h$r8 = h$r5;
      h$r7 = h$r4;
      h$r6 = h$r3;
      h$r5 = h$r2;
      break;
    case (1284):
      h$r10 = h$r6;
      h$r9 = h$r5;
      h$r8 = h$r4;
      h$r7 = h$r3;
      h$r6 = h$r2;
      break;
    default:
      for(var h$RTS_593 = h$RTS_591;(h$RTS_593 > 0);(h$RTS_593--)) {
        h$setReg(((h$RTS_593 + 1) + h$RTS_592), h$getReg((h$RTS_593 + 1)));
      };
  };
};
var h$THUNK_CLOSURE = 0;
var h$FUN_CLOSURE = 1;
var h$PAP_CLOSURE = 3;
var h$CON_CLOSURE = 2;
var h$BLACKHOLE_CLOSURE = 5;
var h$STACKFRAME_CLOSURE = (-1);
function h$closureTypeName(h$RTS_594)
{
  if((h$RTS_594 === 0))
  {
    return "Thunk";
  };
  if((h$RTS_594 === 1))
  {
    return "Fun";
  };
  if((h$RTS_594 === 3))
  {
    return "Pap";
  };
  if((h$RTS_594 === 2))
  {
    return "Con";
  };
  if((h$RTS_594 === 5))
  {
    return "Blackhole";
  };
  if((h$RTS_594 === (-1)))
  {
    return "StackFrame";
  };
  return "InvalidClosureType";
};
function h$runio_e()
{
  h$r1 = h$r1.d1;
  h$stack[++h$sp] = h$ap_1_0;
  return h$ap_1_0;
};
h$o(h$runio_e, 0, 0, 1, 256, null);
function h$runio(h$RTS_595)
{
  return h$c1(h$runio_e, h$RTS_595);
};
function h$flushStdout_e()
{
  h$r1 = h$baseZCGHCziIOziHandlezihFlush;
  h$r2 = h$baseZCGHCziIOziHandleziFDzistdout;
  return h$ap_1_1_fast();
};
h$o(h$flushStdout_e, 0, 0, 0, 0, null);
var h$flushStdout = h$static_thunk(h$flushStdout_e);
var h$RTS_596 = new Date();
function h$ascii(h$RTS_597)
{
  var h$RTS_598 = [];
  for(var h$RTS_599 = 0;(h$RTS_599 < h$RTS_597.length);(h$RTS_599++)) {
    h$RTS_598.push(h$RTS_597.charCodeAt(h$RTS_599));
  };
  h$RTS_598.push(0);
  return h$RTS_598;
};
function h$dumpStackTop(h$RTS_600, h$RTS_601, h$RTS_602)
{
  h$RTS_601 = Math.max(h$RTS_601, 0);
  for(var h$RTS_603 = h$RTS_601;(h$RTS_603 <= h$RTS_602);(h$RTS_603++)) {
    var h$RTS_604 = h$RTS_600[h$RTS_603];
    if((h$RTS_604 && h$RTS_604.n))
    {
      h$log(((("stack[" + h$RTS_603) + "] = ") + h$RTS_604.n));
    }
    else
    {
      if((h$RTS_604 === null))
      {
        h$log((("stack[" + h$RTS_603) + "] = null WARNING DANGER"));
      }
      else
      {
        if((((((typeof h$RTS_604 === "object") && (h$RTS_604 !== null)) && h$RTS_604.hasOwnProperty("f")) && h$RTS_604.
        hasOwnProperty("d1")) && h$RTS_604.hasOwnProperty("d2")))
        {
          if((typeof h$RTS_604.f !== "function"))
          {
            h$log((("stack[" + h$RTS_603) + "] = WARNING: dodgy object"));
          }
          else
          {
            if((h$RTS_604.d1 === undefined))
            {
              h$log((("WARNING: stack[" + h$RTS_603) + "] d1 undefined"));
            };
            if((h$RTS_604.d2 === undefined))
            {
              h$log((("WARNING: stack[" + h$RTS_603) + "] d2 undefined"));
            };
            if(((((h$RTS_604.f.t === 5) && h$RTS_604.d1) && h$RTS_604.d1.x1) && h$RTS_604.d1.x1.n))
            {
              h$log(((("stack[" + h$RTS_603) + "] = blackhole -> ") + h$RTS_604.d1.x1.n));
            }
            else
            {
              var h$RTS_605 = "";
              if(((h$RTS_604.f.n === "integer-gmp:GHC.Integer.Type.Jp#") || (h$RTS_604.f.n === "integer-gmp:GHC.Integer.Type.Jn#")))
              {
                h$RTS_605 = ((((" [" + h$RTS_604.d1.join(",")) + "](") + h$ghcjsbn_showBase(h$RTS_604.d1, 10)) + ")");
              }
              else
              {
                if((h$RTS_604.f.n === "integer-gmp:GHC.Integer.Type.S#"))
                {
                  h$RTS_605 = ((" (S: " + h$RTS_604.d1) + ")");
                };
              };
              h$log((((((((((("stack[" + h$RTS_603) + "] = -> ") + (h$RTS_604.alloc ? (h$RTS_604.alloc + ": ") : "")) + h$RTS_604.f.
              n) + " (") + h$closureTypeName(h$RTS_604.f.t)) + ", a: ") + h$RTS_604.f.a) + ")") + h$RTS_605));
            };
          };
        }
        else
        {
          if(h$isInstanceOf(h$RTS_604, h$MVar))
          {
            var h$RTS_606 = ((h$RTS_604.val === null) ? " empty" : (" value -> " + ((typeof h$RTS_604.
            val === "object") ? (((((h$RTS_604.val.f.n + " (") + h$closureTypeName(h$RTS_604.val.f.t)) + ", a: ") + h$RTS_604.val.f.
            a) + ")") : h$RTS_604.val)));
            h$log(((("stack[" + h$RTS_603) + "] = MVar ") + h$RTS_606));
          }
          else
          {
            if(h$isInstanceOf(h$RTS_604, h$MutVar))
            {
              h$log(((("stack[" + h$RTS_603) + "] = IORef -> ") + ((typeof h$RTS_604.val === "object") ? (((((h$RTS_604.val.f.
              n + " (") + h$closureTypeName(h$RTS_604.val.f.t)) + ", a: ") + h$RTS_604.val.f.a) + ")") : h$RTS_604.val)));
            }
            else
            {
              if(Array.isArray(h$RTS_604))
              {
                h$log(((("stack[" + h$RTS_603) + "] = ") + (("[" + h$RTS_604.join(",")) + "]").substring(0, 50)));
              }
              else
              {
                if((typeof h$RTS_604 === "object"))
                {
                  h$log(((("stack[" + h$RTS_603) + "] = ") + h$collectProps(h$RTS_604).substring(0, 50)));
                }
                else
                {
                  if((typeof h$RTS_604 === "function"))
                  {
                    var h$RTS_607 = new RegExp("([^\\n]+)\\n(.|\\n)*");
                    h$log(((("stack[" + h$RTS_603) + "] = ") + ("" + h$RTS_604).substring(0, 50).replace(h$RTS_607, "$1")));
                  }
                  else
                  {
                    h$log(((("stack[" + h$RTS_603) + "] = ") + ("" + h$RTS_604).substring(0, 50)));
                  };
                };
              };
            };
          };
        };
      };
    };
  };
};
function h$checkObj(h$RTS_608)
{
  if(((typeof h$RTS_608 === "boolean") || (typeof h$RTS_608 === "number")))
  {
    return undefined;
  };
  if(((((!h$RTS_608.hasOwnProperty("f") || (h$RTS_608.f === null)) || (h$RTS_608.f === undefined)) || (h$RTS_608.f.
  a === undefined)) || (typeof h$RTS_608.f !== "function")))
  {
    h$log("h$checkObj: WARNING, something wrong with f:");
    h$log(("" + h$RTS_608).substring(0, 200));
    h$log(h$collectProps(h$RTS_608));
    h$log(typeof h$RTS_608.f);
  };
  if((!h$RTS_608.hasOwnProperty("d1") || (h$RTS_608.d1 === undefined)))
  {
    h$log("h$checkObj: WARNING, something wrong with d1:");
    h$log(("" + h$RTS_608).substring(0, 200));
  }
  else
  {
    if((!h$RTS_608.hasOwnProperty("d2") || (h$RTS_608.d2 === undefined)))
    {
      h$log("h$checkObj: WARNING, something wrong with d2:");
      h$log(("" + h$RTS_608).substring(0, 200));
    }
    else
    {
      if((((h$RTS_608.d2 !== null) && (typeof h$RTS_608.d2 === "object")) && (h$RTS_608.f.size !== 2)))
      {
        var h$RTS_609 = h$RTS_608.d2;
        var h$RTS_610;
        for(h$RTS_610 in h$RTS_609)
        {
          if(h$RTS_609.hasOwnProperty(h$RTS_610))
          {
            if((h$RTS_610.substring(0, 1) != "d"))
            {
              h$log(("h$checkObj: WARNING, unexpected field name: " + h$RTS_610));
              h$log(("" + h$RTS_608).substring(0, 200));
            };
            if((h$RTS_609[h$RTS_610] === undefined))
            {
              h$log(("h$checkObj: WARNING, undefined field detected: " + h$RTS_610));
              h$log(("" + h$RTS_608).substring(0, 200));
            };
          };
        };
        switch (h$RTS_608.f.size)
        {
          case (6):
            if((h$RTS_609.d5 === undefined))
            {
              h$log("h$checkObj: WARNING, undefined field detected: d5");
            };
          case (5):
            if((h$RTS_609.d4 === undefined))
            {
              h$log("h$checkObj: WARNING, undefined field detected: d4");
            };
          case (4):
            if((h$RTS_609.d3 === undefined))
            {
              h$log("h$checkObj: WARNING, undefined field detected: d3");
            };
          case (3):
            if((h$RTS_609.d2 === undefined))
            {
              h$log("h$checkObj: WARNING, undefined field detected: d2");
            };
            if((h$RTS_609.d1 === undefined))
            {
              h$log("h$checkObj: WARNING, undefined field detected: d1");
            };
          default:
            h$RTS_609 = h$RTS_608.d2;
        };
      };
    };
  };
};
function h$traceForeign(h$RTS_611, h$RTS_612)
{
  if(true)
  {
    return undefined;
  };
  var h$RTS_613 = [];
  for(var h$RTS_614 = 0;(h$RTS_614 < h$RTS_612.length);(h$RTS_614++)) {
    var h$RTS_615 = h$RTS_612[h$RTS_614];
    if((h$RTS_615 === null))
    {
      h$RTS_613.push("null");
    }
    else
    {
      if((typeof h$RTS_615 === "object"))
      {
        var h$RTS_616 = h$RTS_615.toString();
        if((h$RTS_616.length > 40))
        {
          h$RTS_613.push((h$RTS_616.substring(0, 40) + "..."));
        }
        else
        {
          h$RTS_613.push(h$RTS_616);
        };
      }
      else
      {
        h$RTS_613.push(("" + h$RTS_615));
      };
    };
  };
  h$log((((("ffi: " + h$RTS_611) + "(") + h$RTS_613.join(",")) + ")"));
};
function h$restoreThread()
{
  var h$RTS_617 = h$stack[(h$sp - 2)];
  var h$RTS_618 = h$stack[(h$sp - 1)];
  var h$RTS_619 = (h$RTS_618 - 3);
  for(var h$RTS_620 = 1;(h$RTS_620 <= h$RTS_619);(h$RTS_620++)) {
    h$setReg(h$RTS_620, h$stack[((h$sp - 2) - h$RTS_620)]);
  };
  h$sp -= h$RTS_618;
  return h$RTS_617;
};
h$o(h$restoreThread, (-1), 0, (-1), 0, null);
function h$return()
{
  h$r1 = h$stack[(h$sp - 1)];
  h$sp -= 2;
  return h$stack[h$sp];
};
h$o(h$return, (-1), 0, 1, 0, null);
function h$returnf()
{
  var h$RTS_621 = h$stack[(h$sp - 1)];
  h$sp -= 2;
  return h$RTS_621;
};
h$o(h$returnf, (-1), 0, 1, 256, null);
function h$reschedule()
{
  return h$reschedule;
};
h$o(h$reschedule, 0, 0, 0, 0, null);
function h$suspendCurrentThread(h$RTS_622)
{
  if((h$RTS_622 === h$reschedule))
  {
    throw("suspend called with h$reschedule");
  };
  if((h$RTS_622.t === (-1)))
  {
    h$stack[h$sp] = h$RTS_622;
  };
  if(((h$stack[h$sp] === h$restoreThread) || (h$RTS_622 === h$return)))
  {
    h$currentThread.sp = h$sp;
    return undefined;
  };
  var h$RTS_623;
  var h$RTS_624 = 0;
  var h$RTS_625 = h$RTS_622.t;
  if((h$RTS_625 === 3))
  {
    h$RTS_623 = ((h$r1.d2.d1 >> 8) + 1);
  }
  else
  {
    if(((h$RTS_625 === 1) || (h$RTS_625 === (-1))))
    {
      h$RTS_623 = (h$RTS_622.r >> 8);
      h$RTS_624 = (h$RTS_622.r & 255);
    }
    else
    {
      h$RTS_623 = 1;
    };
  };
  h$sp = (((h$sp + h$RTS_623) + h$RTS_624) + 3);
  for(var h$RTS_626 = 1;(h$RTS_626 <= h$RTS_624);(h$RTS_626++)) {
    h$stack[((h$sp - 2) - h$RTS_626)] = null;
  };
  for(h$RTS_626 = (h$RTS_624 + 1);(h$RTS_626 <= (h$RTS_623 + h$RTS_624));(h$RTS_626++)) {
    h$stack[((h$sp - 2) - h$RTS_626)] = h$getReg(h$RTS_626);
  };
  h$stack[(h$sp - 2)] = h$RTS_622;
  h$stack[(h$sp - 1)] = ((h$RTS_623 + h$RTS_624) + 3);
  h$stack[h$sp] = h$restoreThread;
  h$currentThread.sp = h$sp;
};
function h$dumpRes()
{
  h$log(("h$dumpRes result: " + h$stack[(h$sp - 1)]));
  h$log(h$r1);
  h$log(h$collectProps(h$r1));
  if((h$r1.f && h$r1.f.n))
  {
    h$log(("name: " + h$r1.f.n));
  };
  if(h$r1.hasOwnProperty("d1"))
  {
    h$log(("d1: " + h$r1.d1));
  };
  if(h$r1.hasOwnProperty("d2"))
  {
    h$log(("d2: " + h$r1.d2));
  };
  if(h$r1.f)
  {
    var h$RTS_627 = new RegExp("([^\\n]+)\\n(.|\\n)*");
    h$log(("function: " + ("" + h$r1.f).substring(0, 50).replace(h$RTS_627, "$1")));
  };
  h$sp -= 2;
  return h$stack[h$sp];
};
h$o(h$dumpRes, 0, 0, 1, 256, null);
function h$resume_e()
{
  var h$RTS_628 = h$r1.d1;
  h$bh();
  for(var h$RTS_629 = 0;(h$RTS_629 < h$RTS_628.length);(h$RTS_629++)) {
    h$stack[((h$sp + 1) + h$RTS_629)] = h$RTS_628[h$RTS_629];
  };
  h$sp += h$RTS_628.length;
  h$r1 = null;
  return h$stack[h$sp];
};
h$o(h$resume_e, 0, 0, 0, 256, null);
function h$unmaskFrame()
{
  h$currentThread.mask = 0;
  --h$sp;
  if((h$currentThread.excep.length > 0))
  {
    h$p2(h$r1, h$return);
    return h$reschedule;
  }
  else
  {
    return h$stack[h$sp];
  };
};
h$o(h$unmaskFrame, (-1), 0, 0, 256, null);
function h$maskFrame()
{
  h$currentThread.mask = 2;
  --h$sp;
  return h$stack[h$sp];
};
h$o(h$maskFrame, (-1), 0, 0, 256, null);
function h$maskUnintFrame()
{
  h$currentThread.mask = 1;
  --h$sp;
  return h$stack[h$sp];
};
h$o(h$maskUnintFrame, (-1), 0, 0, 256, null);
function h$unboxFFIResult()
{
  var h$RTS_630 = h$r1.d1;
  for(var h$RTS_631 = 0;(h$RTS_631 < h$RTS_630.length);(h$RTS_631++)) {
    h$setReg((h$RTS_631 + 1), h$RTS_630[h$RTS_631]);
  };
  --h$sp;
  return h$stack[h$sp];
};
h$o(h$unboxFFIResult, (-1), 0, 0, 256, null);
function h$unbox_e()
{
  h$r1 = h$r1.d1;
  return h$stack[h$sp];
};
h$o(h$unbox_e, 0, 0, 1, 256, null);
function h$retryInterrupted()
{
  var h$RTS_632 = h$stack[(h$sp - 1)];
  h$sp -= 2;
  return h$RTS_632[0].apply(this, h$RTS_632.slice(1));
};
h$o(h$retryInterrupted, (-1), 0, 1, 256, null);
function h$atomically_e()
{
  if(h$stmValidateTransaction())
  {
    h$stmCommitTransaction();
    h$sp -= 2;
    return h$stack[h$sp];
  }
  else
  {
    ++h$sp;
    h$stack[h$sp] = h$checkInvariants_e;
    return h$stmStartTransaction(h$stack[(h$sp - 2)]);
  };
};
h$o(h$atomically_e, (-1), 0, 1, 256, null);
function h$checkInvariants_e()
{
  --h$sp;
  return h$stmCheckInvariants();
};
h$o(h$checkInvariants_e, (-1), 0, 0, 256, null);
function h$stmCheckInvariantStart_e()
{
  var h$RTS_633 = h$stack[(h$sp - 2)];
  var h$RTS_634 = h$stack[(h$sp - 1)];
  var h$RTS_635 = h$currentThread.mask;
  h$sp -= 3;
  var h$RTS_636 = new h$Transaction(h$RTS_634.action, h$RTS_633);
  h$RTS_636.checkRead = new h$Set();
  h$currentThread.transaction = h$RTS_636;
  h$p4(h$RTS_636, h$RTS_635, h$stmInvariantViolatedHandler, h$catchStm_e);
  h$r1 = h$RTS_634.action;
  return h$ap_1_0_fast();
};
h$o(h$stmCheckInvariantStart_e, (-1), 0, 2, 0, null);
function h$stmCheckInvariantResult_e()
{
  var h$RTS_637 = h$stack[(h$sp - 1)];
  h$sp -= 2;
  h$stmUpdateInvariantDependencies(h$RTS_637);
  h$stmAbortTransaction();
  return h$stack[h$sp];
};
h$o(h$stmCheckInvariantResult_e, (-1), 0, 1, 256, null);
function h$stmInvariantViolatedHandler_e()
{
  if((h$stack[h$sp] !== h$stmCheckInvariantResult_e))
  {
    throw("h$stmInvariantViolatedHandler_e: unexpected value on stack");
  };
  var h$RTS_638 = h$stack[(h$sp - 1)];
  h$sp -= 2;
  h$stmUpdateInvariantDependencies(h$RTS_638);
  h$stmAbortTransaction();
  return h$throw(h$r2, false);
};
h$o(h$stmInvariantViolatedHandler_e, 1, 258, 0, 256, null);
var h$stmInvariantViolatedHandler = h$c(h$stmInvariantViolatedHandler_e);
function h$stmCatchRetry_e()
{
  h$sp -= 2;
  h$stmCommitTransaction();
  return h$stack[h$sp];
};
h$o(h$stmCatchRetry_e, (-1), 0, 1, 256, null);
function h$catchStm_e()
{
  h$sp -= 4;
  return h$stack[h$sp];
};
h$o(h$catchStm_e, (-1), 0, 3, 256, null);
function h$stmResumeRetry_e()
{
  if((h$stack[(h$sp - 2)] !== h$atomically_e))
  {
    throw("h$stmResumeRetry_e: unexpected value on stack");
  };
  var h$RTS_639 = h$stack[(h$sp - 1)];
  h$sp -= 2;
  ++h$sp;
  h$stack[h$sp] = h$checkInvariants_e;
  h$stmRemoveBlockedThread(h$RTS_639, h$currentThread);
  return h$stmStartTransaction(h$stack[(h$sp - 2)]);
};
h$o(h$stmResumeRetry_e, (-1), 0, 0, 256, null);
function h$lazy_e()
{
  var h$RTS_640 = h$r1.d1();
  h$bh();
  h$r1 = h$RTS_640;
  return h$stack[h$sp];
};
h$o(h$lazy_e, 0, 0, 0, 256, null);
