
2.2.1 / 2023-07-28
==================

**fixes**
  * [[`6e81e7f`](http://github.com/sofastack/sofa-hessian-node/commit/6e81e7fd8a730c397a0a7ed395412226b56d6ba0)] - fix: wrap enum name with [""] (#38) (killa <<killa123@126.com>>)

2.2.0 / 2022-03-13
==================

**fixes**
  * [[`3e5761d`](http://github.com/sofastack/sofa-hessian-node/commit/3e5761d0bf15290d568325d41387a44b77a95d79)] - fix: should judge empty when fill attr prop with refType prop (mansonchor.github.com <<mansonchor1987@gmail.com>>)
  * [[`b77d7fd`](http://github.com/sofastack/sofa-hessian-node/commit/b77d7fd121211cac3702fb8926af2630f515571d)] - fix: set debug options with call func (mansonchor <<mansonchor1987@gmail.com>>)
  * [[`8452aad`](http://github.com/sofastack/sofa-hessian-node/commit/8452aadb455aed463aa2f6630064a220c95abd3e)] - fix: primitive type get type should adapt $class (#34) (mansonchor.github.com <<mansonchor1987@gmail.com>>)
  * [[`c6ac845`](http://github.com/sofastack/sofa-hessian-node/commit/c6ac845738642bf9917e308bbd5eff72117202db)] - fix: fix set encode (killa <<killa123@126.com>>)

**others**
  * [[`1d4d142`](http://github.com/sofastack/sofa-hessian-node/commit/1d4d142cb8af8949d4d96424f1608fec7d9220f1)] - opt: pre read debug env before compile (killa <<killa123@126.com>>)

2.1.0 / 2020-07-01
==================

**features**
  * [[`bd303c7`](http://github.com/sofastack/sofa-hessian-node/commit/bd303c74f4d23def37936a8f617747f5344b53a7)] - feat: every classMap will has own compileCache (#30) (陈峰 <<348018533@qq.com>>)

2.0.0 / 2020-06-16
==================

**features**
  * [[`8f12c8b`](http://github.com/sofastack/sofa-hessian-node/commit/8f12c8bdaac78d3cde26c1530c9357d07612493f)] - feat: support hessian 4 (#28) (zōng yǔ <<gxcsoccer@users.noreply.github.com>>)

1.8.0 / 2020-05-13
==================

**features**
  * [[`24888e2`](http://github.com/sofastack/sofa-hessian-node/commit/24888e2d3202a4eb9c9be40ebf8553656bd6180b)] - feat: export compile cache set function (#27) (mansonchor.github.com <<mansonchor@126.com>>)

1.7.1 / 2020-03-30
==================

**fixes**
  * [[`5bf7db4`](http://github.com/sofastack/sofa-hessian-node/commit/5bf7db4cdb26f2a092b71e3649e955b59293689f)] - fix: fix some generic case (#26) (killa <<killa123@126.com>>)
  * [[`7a46513`](http://github.com/sofastack/sofa-hessian-node/commit/7a4651303702610d3f2e372d56b3b52357e6441e)] - fix: fix array generic type should start with [ (#25) (killa <<killa123@126.com>>)

1.7.0 / 2020-02-25
==================

**features**
  * [[`536d240`](http://github.com/alipay/sofa-hessian-node/commit/536d2400e447f11e495c4dcc39038deafed68974)] - feat: support generic param pass case with typeVar=true, should parse the real type (#24) (mansonchor.github.com <<mansonchor@126.com>>)

1.6.3 / 2019-10-12
==================

**fixes**
  * [[`c74b48b`](http://github.com/sofastack/sofa-hessian-node/commit/c74b48b47ca67254958d3d6dd3f3f484a20186b7)] - fix: should use default val if prop val is undefined (#23) (killa <<killa123@126.com>>)

1.6.2 / 2019-10-11
==================

**fixes**
  * [[`80f9d8d`](http://github.com/sofastack/sofa-hessian-node/commit/80f9d8d355b28ea0aa4d7053a4c9a1eaf5a4f1e6)] - fix: only use defaultValue while user not set it (#22) (zōng yǔ <<gxcsoccer@users.noreply.github.com>>)

1.6.1 / 2019-10-10
==================

**fixes**
  * [[`a0c55c3`](http://github.com/sofastack/sofa-hessian-node/commit/a0c55c390141dd5f2b0d315abadb643848dcb2db)] - fix: support getter defaultValue (#21) (zōng yǔ <<gxcsoccer@users.noreply.github.com>>)

1.6.0 / 2019-07-22
==================

**features**
  * [[`f97ea47`](http://github.com/sofastack/sofa-hessian-node/commit/f97ea47f3a896801a477fd776c49ac44f149cbc4)] - feat: support convert string to int (#20) (zōng yǔ <<gxcsoccer@users.noreply.github.com>>)

1.5.1 / 2019-03-22
==================

**fixes**
  * [[`83026eb`](http://github.com/alipay/sofa-hessian-node/commit/83026ebd616c2d1c0fdba45649fc78fca905c091)] - fix: fix when enum name not equal $name (#19) (killa <<killa123@126.com>>)

1.5.0 / 2019-03-06
==================

**features**
  * [[`7dae8ca`](http://github.com/alipay/sofa-hessian-node/commit/7dae8cace6c55cf769b1d7aec370b0a43fb14ca9)] - feat: validate enum name (#18) (killa <<killa123@126.com>>)

1.4.0 / 2019-02-19
==================

**features**
  * [[`014e2d3`](http://github.com/alipay/sofa-hessian-node/commit/014e2d3e2dd36de0a612693f0cf62c2b478165c9)] - feat: support java.util.concurrent.atomic.AtomicLong (#16) (zōng yǔ <<gxcsoccer@users.noreply.github.com>>)

1.3.0 / 2019-02-14
==================

**features**
  * [[`6a0fb0f`](http://github.com/alipay/sofa-hessian-node/commit/6a0fb0faaa4084574da6743d51c81b088da98b51)] - feat: compatible with property with $class & $ (#15) (zōng yǔ <<gxcsoccer@users.noreply.github.com>>)

1.2.0 / 2019-01-28
==================

**fixes**
  * [[`02a7b58`](http://github.com/alipay/sofa-hessian-node/commit/02a7b58dd7e739ed2bc3a8572c78168d96be0283)] - fix: enum default encode with (#14) (tangyao <<2001-wms@163.com>>)

1.1.2 / 2019-01-18
==================

**fixes**
  * [[`daf8213`](http://github.com/alipay/sofa-hessian-node/commit/daf821336e7959a669d4899f1a82f501b5b5b2b1)] - fix: nested generic bug (#13) (zōng yǔ <<gxcsoccer@users.noreply.github.com>>)

1.1.1 / 2019-01-11
==================

**fixes**
  * [[`7a3e717`](http://github.com/alipay/sofa-hessian-node/commit/7a3e7174b8bf2c234de485815a5e382899556c8b)] - fix: give a default value to options of compile (#12) (zōng yǔ <<gxcsoccer@users.noreply.github.com>>)

1.1.0 / 2019-01-11
==================

**features**
  * [[`cb4df5d`](http://github.com/alipay/sofa-hessian-node/commit/cb4df5d57a62c1e2aa54fe4f2292e68c38d9178d)] - feat: add debug mode (#10) (killa <<killa123@126.com>>)

1.0.7 / 2019-01-02
==================

**fixes**
  * [[`ad6e892`](http://github.com/alipay/sofa-hessian-node/commit/ad6e89205476e8df5e75459eeb8b46eacb15be5d)] - fix: encoding list error with generic array type (#9) (zōng yǔ <<gxcsoccer@users.noreply.github.com>>)

1.0.6 / 2018-11-27
==================

**fixes**
  * [[`5abb263`](http://github.com/alipay/sofa-hessian-node/commit/5abb26346f760c41bfbc5ec25e9c37b2fe9c69c4)] - fix: enum should be in object ref list (#8) (killa <<killa123@126.com>>)

1.0.5 / 2018-11-27
==================

**fixes**
  * [[`0ed18dd`](http://github.com/alipay/sofa-hessian-node/commit/0ed18dd9ad0e1774e680d74bc30fb598d4b915e2)] - fix: support list property with $class & $ (#7) (zōng yǔ <<gxcsoccer@users.noreply.github.com>>)

1.0.4 / 2018-11-24
==================

**fixes**
  * [[`fc59ab4`](http://github.com/alipay/sofa-hessian-node/commit/fc59ab4bd5e9f4973491b3be1bb354990913d6d6)] - fix: prop defaultValue encode confused (#6) (zōng yǔ <<gxcsoccer@users.noreply.github.com>>)

1.0.3 / 2018-10-19
==================

**fixes**
  * [[`27ec0d5`](http://github.com/alipay/sofa-hessian-node/commit/27ec0d587d302e0bef370d46a1cbcaeea3c15061)] - fix: encode enum defaultValue issue & list generic issue (#5) (zōng yǔ <<gxcsoccer@users.noreply.github.com>>)

1.0.2 / 2018-08-02
==================

**fixes**
  * [[`a847bf4`](http://github.com/alipay/sofa-hessian-node/commit/a847bf4232ad1e4a3396a8f25f58c254b2684d2b)] - fix: support class inheritance (#4) (zōng yǔ <<gxcsoccer@users.noreply.github.com>>)

1.0.1 / 2018-07-04
==================

**fixes**
  * [[`bef4f5f`](http://github.com/alipay/sofa-hessian-node/commit/bef4f5ffe1aeafe2f891c2bec13e31924a9be78b)] - fix: support generic + typeAliasIndex (#2) (zōng yǔ <<gxcsoccer@users.noreply.github.com>>)

1.0.0 / 2018-06-28
==================

**others**
,fatal: No names found, cannot describe anything.

