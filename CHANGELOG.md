# [1.25.0](https://github.com/viniciusferreira7/url-shortener-api/compare/v1.24.1...v1.25.0) (2026-01-31)


### Bug Fixes

* add empty GH_TOKEN to E2E test environment ([b50edce](https://github.com/viniciusferreira7/url-shortener-api/commit/b50edce7566a0dc87667f6d6846c459b4d5ef83a))
* configure Redis with password authentication in CI ([bd9511c](https://github.com/viniciusferreira7/url-shortener-api/commit/bd9511c51e0dea86237c4f26ad7d6782280e0812))
* correct E2E test path in package.json ([dca2251](https://github.com/viniciusferreira7/url-shortener-api/commit/dca225110f4638addbefae8ec2d23c52e2eb1429))
* correct PostgreSQL and Redis health checks in CI ([1e02421](https://github.com/viniciusferreira7/url-shortener-api/commit/1e024218ef9f966611ea5cef36f2151f484b2ec3))
* exclude E2E tests from unit test command ([28d5f37](https://github.com/viniciusferreira7/url-shortener-api/commit/28d5f377ff33466b98237bbd9f1393f7ed91f4f9))
* remove quotes from E2E test glob pattern ([7192058](https://github.com/viniciusferreira7/url-shortener-api/commit/71920584480ead9d42cff98651ed0c38edc4852f))
* remove Redis password from CI service ([1a9c070](https://github.com/viniciusferreira7/url-shortener-api/commit/1a9c0706c769bd94a9cf352b87846b29c63d943e))
* remove secrets from Redis service options in CI ([051a28f](https://github.com/viniciusferreira7/url-shortener-api/commit/051a28f3e30c7cdd3e27088ec21dba35bcc7f718))
* simplify test paths to use directories ([246c6f9](https://github.com/viniciusferreira7/url-shortener-api/commit/246c6f9142c729dec478c71a700e943586a8e532))
* update response schema validation for UUID v4 ([de2f2dd](https://github.com/viniciusferreira7/url-shortener-api/commit/de2f2ddca08093b7c0a0b2b740df014cff5c13bb))
* use explicit glob patterns for unit tests ([ea73ef3](https://github.com/viniciusferreira7/url-shortener-api/commit/ea73ef3c29a96c51e9e34589fbee0bd87eed0682))
* use path-based glob patterns for test isolation ([0e084d0](https://github.com/viniciusferreira7/url-shortener-api/commit/0e084d07b118d36dfbbe877d745bc7355160fb22))
* use test name pattern to exclude E2E tests ([effcad2](https://github.com/viniciusferreira7/url-shortener-api/commit/effcad24272842e3b4fdd61aefa4d5e0165633a0))


### Features

* add E2E testing infrastructure ([a769ed2](https://github.com/viniciusferreira7/url-shortener-api/commit/a769ed21833384cb1da7b32432e4744dabe2c4d3))

## [1.24.1](https://github.com/viniciusferreira7/url-shortener-api/compare/v1.24.0...v1.24.1) (2026-01-27)


### Bug Fixes

* correct port mapping ([f74f370](https://github.com/viniciusferreira7/url-shortener-api/commit/f74f37037c923858bf9d17a92b05d42ef571ba14))

# [1.24.0](https://github.com/viniciusferreira7/url-shortener-api/compare/v1.23.0...v1.24.0) (2026-01-27)


### Features

* add validation for missing envs ([9c97fb6](https://github.com/viniciusferreira7/url-shortener-api/commit/9c97fb680fe24e484ee8cf084472698069f39a9a))

# [1.23.0](https://github.com/viniciusferreira7/url-shortener-api/compare/v1.22.1...v1.23.0) (2026-01-25)


### Bug Fixes

* add missing param ([0bec22b](https://github.com/viniciusferreira7/url-shortener-api/commit/0bec22b495c368c3d6b16951bc369c34fc813ab0))
* correct constructor ([ab7925e](https://github.com/viniciusferreira7/url-shortener-api/commit/ab7925ee4e8b3606e0e24ade67be586fadd0635e))
* correct query to verify connection with database ([0a0398d](https://github.com/viniciusferreira7/url-shortener-api/commit/0a0398dd49b734416f5d7464410d56fa41d68a44))
* correct SQL to drop schema ([461d4a1](https://github.com/viniciusferreira7/url-shortener-api/commit/461d4a14588b5bb338ccd11b41b5304cdf815382))


### Features

* add secondary storage using redis ([a4735f2](https://github.com/viniciusferreira7/url-shortener-api/commit/a4735f2aa979a21679df823398f26f00765303b4))
* create controller to create URL ([ca0eff4](https://github.com/viniciusferreira7/url-shortener-api/commit/ca0eff4a406a97186f4341056d3a717ec58c5ec6))
* create factory for check services health use case ([9ba79fd](https://github.com/viniciusferreira7/url-shortener-api/commit/9ba79fdd64f5077c76e3dd327fe90559c294f172))
* create health and ready check for external services like redis and postgres ([810c679](https://github.com/viniciusferreira7/url-shortener-api/commit/810c67979f0fc32d981be462e3e7e016e2bf192b))
* create migrations for tables ([1549a41](https://github.com/viniciusferreira7/url-shortener-api/commit/1549a4116a5d22620f2f50ca58fcae1802926d9a))
* create system module with health check use case ([8128426](https://github.com/viniciusferreira7/url-shortener-api/commit/81284266931ec4b0a3eb958ab461e604f2796fc1))
* create url presenter ([fd55885](https://github.com/viniciusferreira7/url-shortener-api/commit/fd558854be851d4eb0e730784bd4ca95b40da9ae))
* implement system health repository for PostgreSQL and Redis checks ([0b561cf](https://github.com/viniciusferreira7/url-shortener-api/commit/0b561cf7c5f3aeca6ec10556f8b9a47a73f0644d))
* schema of url to use on response ([e9758a6](https://github.com/viniciusferreira7/url-shortener-api/commit/e9758a6c8f876beda3e284f96aa968c1fe132643))

## [1.22.1](https://github.com/viniciusferreira7/url-shortener-api/compare/v1.22.0...v1.22.1) (2026-01-18)


### Bug Fixes

* correct type error on redis analysis repository ([a1e8434](https://github.com/viniciusferreira7/url-shortener-api/commit/a1e84345dc58be1456f211c5751b97a3847a0ab3))

# [1.22.0](https://github.com/viniciusferreira7/url-shortener-api/compare/v1.21.0...v1.22.0) (2026-01-17)


### Features

* add cache repository infrastructure ([389a3e0](https://github.com/viniciusferreira7/url-shortener-api/commit/389a3e0b44de8e038f2e24128e2f71bfd8cce767))
* add score field and optimize ranking cache logic ([8d17a5f](https://github.com/viniciusferreira7/url-shortener-api/commit/8d17a5f4e008a490fde290a8f5a37222038163bb))
* implement Cache-Aside pattern in DrizzleUrlsRepository ([206e09d](https://github.com/viniciusferreira7/url-shortener-api/commit/206e09d1b4de0237a9dfb620375fc809416a4c0c))
* implement toDrizzle and fromCache in UrlWithAuthor mapper ([1b030b5](https://github.com/viniciusferreira7/url-shortener-api/commit/1b030b592911bfedcdcbac033568d54ccec83e3d))
* inject RedisCacheRepository in all URL use case factories ([de2df67](https://github.com/viniciusferreira7/url-shortener-api/commit/de2df6702b5ac16d21c89b513d46dbe93a3d052a))

# [1.22.0](https://github.com/viniciusferreira7/url-shortener-api/compare/v1.21.0...v1.22.0) (2026-01-17)


### Features

* add cache repository infrastructure ([389a3e0](https://github.com/viniciusferreira7/url-shortener-api/commit/389a3e0b44de8e038f2e24128e2f71bfd8cce767))
* implement Cache-Aside pattern in DrizzleUrlsRepository ([206e09d](https://github.com/viniciusferreira7/url-shortener-api/commit/206e09d1b4de0237a9dfb620375fc809416a4c0c))
* implement toDrizzle and fromCache in UrlWithAuthor mapper ([1b030b5](https://github.com/viniciusferreira7/url-shortener-api/commit/1b030b592911bfedcdcbac033568d54ccec83e3d))
* inject RedisCacheRepository in all URL use case factories ([de2df67](https://github.com/viniciusferreira7/url-shortener-api/commit/de2df6702b5ac16d21c89b513d46dbe93a3d052a))

# [1.22.0](https://github.com/viniciusferreira7/url-shortener-api/compare/v1.21.0...v1.22.0) (2026-01-17)


### Features

* add cache repository infrastructure ([389a3e0](https://github.com/viniciusferreira7/url-shortener-api/commit/389a3e0b44de8e038f2e24128e2f71bfd8cce767))
* implement Cache-Aside pattern in DrizzleUrlsRepository ([206e09d](https://github.com/viniciusferreira7/url-shortener-api/commit/206e09d1b4de0237a9dfb620375fc809416a4c0c))
* implement toDrizzle and fromCache in UrlWithAuthor mapper ([1b030b5](https://github.com/viniciusferreira7/url-shortener-api/commit/1b030b592911bfedcdcbac033568d54ccec83e3d))
* inject RedisCacheRepository in all URL use case factories ([de2df67](https://github.com/viniciusferreira7/url-shortener-api/commit/de2df6702b5ac16d21c89b513d46dbe93a3d052a))

# [1.21.0](https://github.com/viniciusferreira7/url-shortener-api/compare/v1.20.0...v1.21.0) (2026-01-17)


### Bug Fixes

* adjust ID generation sequence in CreateUrlUseCase ([4e77b5c](https://github.com/viniciusferreira7/url-shortener-api/commit/4e77b5c2b540170010ec62e6ef45487c734cf5bb))


### Features

* migrate from base62 to Hashids for URL code generation ([830689a](https://github.com/viniciusferreira7/url-shortener-api/commit/830689a80af01c3e2069f98f8bf28b9c072647c6))

# [1.20.0](https://github.com/viniciusferreira7/url-shortener-api/compare/v1.19.0...v1.20.0) (2026-01-11)


### Bug Fixes

* correct import paths and dependencies in factories ([8bdfc48](https://github.com/viniciusferreira7/url-shortener-api/commit/8bdfc48b74301d11a5bc87316c10acd0565ff17b))
* correct path of drizzle config ([3f1b1bd](https://github.com/viniciusferreira7/url-shortener-api/commit/3f1b1bd6098df70d208dbdc521d16c5264f44107))


### Features

* add Base62UrlCodeGenerator implementation ([730cc3d](https://github.com/viniciusferreira7/url-shortener-api/commit/730cc3d15793104ab3bbbfaa62002382e1399d17))
* add factories barrel export ([3117da2](https://github.com/viniciusferreira7/url-shortener-api/commit/3117da23474328e0c4ca511f4d186bc4fd465c4c))
* add factory for CreateUrlUseCase ([95941ae](https://github.com/viniciusferreira7/url-shortener-api/commit/95941aec29130ce07764ef4559e9481a1708c21f))
* add factory for DeleteUrlUseCase ([b033091](https://github.com/viniciusferreira7/url-shortener-api/commit/b0330915885e947ea650e6b52ef1cb7f1d8f97e4))
* add factory for FetchManyPublicUrlsUseCase ([9553092](https://github.com/viniciusferreira7/url-shortener-api/commit/9553092d120e0ff17b9fe89c6dcf8bf08d85bb32))
* add factory for FetchUserLikedUrlsUseCase ([2870c96](https://github.com/viniciusferreira7/url-shortener-api/commit/2870c96e17152e02df75641ef1f9c16d80df8f00))
* add factory for FetchUserUrlsUseCase ([080cf73](https://github.com/viniciusferreira7/url-shortener-api/commit/080cf73861c1ec82bc96fbd8395a61cd89474da7))
* add factory for GetRankingByMostLikedUseCase ([472892d](https://github.com/viniciusferreira7/url-shortener-api/commit/472892d8adba81c42d8c409544bfaa925cbb5dab))
* add factory for GetRankingUseCase ([92ed94d](https://github.com/viniciusferreira7/url-shortener-api/commit/92ed94da677c9171bd84bf02eed1015871986b1a))
* add factory for GetUrlByCodeUseCase ([99a989f](https://github.com/viniciusferreira7/url-shortener-api/commit/99a989f84ee87c1248d1337707d7ffd97f24ed6e))
* add factory for GetUrlByIdUseCase ([8dd3a4b](https://github.com/viniciusferreira7/url-shortener-api/commit/8dd3a4b3da4d5b1a37af5d0e356935822e5d7601))
* add factory for LikeUrlUseCase ([381cf4c](https://github.com/viniciusferreira7/url-shortener-api/commit/381cf4c931e85e5ee1a8080f0549aa26123d0dfd))
* add factory for UnlikeUrlUseCase ([535c6c4](https://github.com/viniciusferreira7/url-shortener-api/commit/535c6c4e14b8740ada29fded11390122746a573c))
* add factory for UpdateUrlUseCase ([a700839](https://github.com/viniciusferreira7/url-shortener-api/commit/a70083939adb927d7f965b5e4e5091962dc4fb5d))
* create redis analysis repository ([e00d284](https://github.com/viniciusferreira7/url-shortener-api/commit/e00d2846399d4e3229198ce776e43fdaecdc956a))
* implement all methods od analysis repository into redis analysis repository ([6e97bd8](https://github.com/viniciusferreira7/url-shortener-api/commit/6e97bd8eb85d3838f4b03d476274653f63aab272))
* re-add factories barrel export ([d0bdd41](https://github.com/viniciusferreira7/url-shortener-api/commit/d0bdd41f586676c11404db824e23b4b1f36217b0))

# [1.19.0](https://github.com/viniciusferreira7/url-shortener-api/compare/v1.18.0...v1.19.0) (2026-01-04)


### Bug Fixes

* apply corrections ([2d89822](https://github.com/viniciusferreira7/url-shortener-api/commit/2d89822143bdccff1e5e122d37135321763ab4c8))


### Features

* add config to use cassandra ([d65f4c8](https://github.com/viniciusferreira7/url-shortener-api/commit/d65f4c80ed193778b41fb03108f4449ae473a25d))
* add drizzle mapper ([0227c6b](https://github.com/viniciusferreira7/url-shortener-api/commit/0227c6b76fe5d762cf3e41d88ad75bca90110239))
* add drizzle user repository ([bebce5a](https://github.com/viniciusferreira7/url-shortener-api/commit/bebce5a3d0e15e7a1d00538c0344eb1f4add6b05))
* add optional type ([9ea2ef9](https://github.com/viniciusferreira7/url-shortener-api/commit/9ea2ef990656ca43b94e13838bc3d83fd36fc820))
* create drizzle url mapper ([39c12f7](https://github.com/viniciusferreira7/url-shortener-api/commit/39c12f72fa870df274a16a7fcb1ecd6749161a5f))
* create relationship between user and url ([a494e82](https://github.com/viniciusferreira7/url-shortener-api/commit/a494e8226b41fcc1a573567441840ec4073aba18))
* create url schema ([f243216](https://github.com/viniciusferreira7/url-shortener-api/commit/f243216db5194a1b9a10556be15622f7fa30bfa2))
* create use case for fetch user liked urls ([e041b1c](https://github.com/viniciusferreira7/url-shortener-api/commit/e041b1c6a080a54bc31f40beb72b06bb365262dd))
* implement missing methods into drizzle url repository ([641a310](https://github.com/viniciusferreira7/url-shortener-api/commit/641a3107b39d2d80cf109de1ded2e1fb1a080fc9))

# [1.18.0](https://github.com/viniciusferreira7/url-shortener-api/compare/v1.17.0...v1.18.0) (2025-12-14)


### Features

* add cassandra driver ([b8944b2](https://github.com/viniciusferreira7/url-shortener-api/commit/b8944b22330a45da78b9713e78add11fe7e45001))
* add cassandra service ([0009cf7](https://github.com/viniciusferreira7/url-shortener-api/commit/0009cf7544f33b218dd0fa1c9aa6ed8a2f40cf8e))
* add plugins for elysia ([21b56cd](https://github.com/viniciusferreira7/url-shortener-api/commit/21b56cde9783074140b8e41c8fbc9da14abcc30f))

# [1.17.0](https://github.com/viniciusferreira7/url-shortener-api/compare/v1.16.0...v1.17.0) (2025-12-07)


### Features

* create use case to get ranking by most liked urls ([d2752a8](https://github.com/viniciusferreira7/url-shortener-api/commit/d2752a84832c0d365436c81ae10d3920833a3a04))

# [1.16.0](https://github.com/viniciusferreira7/url-shortener-api/compare/v1.15.0...v1.16.0) (2025-12-07)


### Bug Fixes

* correct filter of url ids ([2dc3020](https://github.com/viniciusferreira7/url-shortener-api/commit/2dc302067b5fbfdf59e418147cd17221d7580132))
* correct setter from url with author ([42b3cf1](https://github.com/viniciusferreira7/url-shortener-api/commit/42b3cf1c60ea95ba3b3e3f6c051627c56ec31497))


### Features

* add missing methods into in memory urls and cache repository ([60147cc](https://github.com/viniciusferreira7/url-shortener-api/commit/60147cc09707c402f0fbe66c2da9d09752d8a517))
* add url into ranking ([8a26001](https://github.com/viniciusferreira7/url-shortener-api/commit/8a260011ff49cc5e447363efe773fe14b8c8cf63))
* create use case to get url ranking ([4481b13](https://github.com/viniciusferreira7/url-shortener-api/commit/4481b13a52f5ec710314736aca18a174ed1dc6ff))

# [1.15.0](https://github.com/viniciusferreira7/url-shortener-api/compare/v1.14.0...v1.15.0) (2025-11-23)


### Features

* create use case to like url ([37fc6c1](https://github.com/viniciusferreira7/url-shortener-api/commit/37fc6c16f42409c619dc3f32758dd6d50665d155))
* create use case to remove like ([6a42987](https://github.com/viniciusferreira7/url-shortener-api/commit/6a42987d10b885d779de132e4a0662997e6a71e4))

# [1.14.0](https://github.com/viniciusferreira7/url-shortener-api/compare/v1.13.0...v1.14.0) (2025-11-23)


### Features

* apply cache logic into fetch many public urls use case ([1a2652f](https://github.com/viniciusferreira7/url-shortener-api/commit/1a2652fbc758d7bc73966f2fcf2fb5150f5d7db8))

# [1.13.0](https://github.com/viniciusferreira7/url-shortener-api/compare/v1.12.0...v1.13.0) (2025-11-23)


### Features

* create use case to get url by code ([c6e528a](https://github.com/viniciusferreira7/url-shortener-api/commit/c6e528a655765d08d69beeb91a8d14c37bfc3d75))
* create use case to get url by id ([1f9f5e6](https://github.com/viniciusferreira7/url-shortener-api/commit/1f9f5e63b5fd20457fdd461836c27eea129cfb49))

# [1.12.0](https://github.com/viniciusferreira7/url-shortener-api/compare/v1.11.0...v1.12.0) (2025-11-23)


### Features

* create use case to update url ([1a9bf61](https://github.com/viniciusferreira7/url-shortener-api/commit/1a9bf61a36b67bbbf509a822550fb34ad4f8c5c4))

# [1.11.0](https://github.com/viniciusferreira7/url-shortener-api/compare/v1.10.0...v1.11.0) (2025-11-16)


### Bug Fixes

* correct in memory urls repository ([d20fd04](https://github.com/viniciusferreira7/url-shortener-api/commit/d20fd04e1878c80eec84d1ea2a5b0a0835283929))


### Features

* add custom config for openapi ([401b6e3](https://github.com/viniciusferreira7/url-shortener-api/commit/401b6e305e1dc9be4a063571e98983d87140403d))
* add watched list to urls liked ([456f794](https://github.com/viniciusferreira7/url-shortener-api/commit/456f794fec171db1c266468d4e3d743995cd16bb))
* apply new params on urls repository methods ([9825bff](https://github.com/viniciusferreira7/url-shortener-api/commit/9825bff3ec538b3f3ea7288179fbe11a71448d6e))
* create use case to delete url ([179f881](https://github.com/viniciusferreira7/url-shortener-api/commit/179f881e874c2c22cdb631f6d58d976446d47910))
* create use case to fetch author urls ([ac9c208](https://github.com/viniciusferreira7/url-shortener-api/commit/ac9c2088301f42b58443c6988c49b6294ce291ec))
* create use case to fetch many public urls ([b41d8f8](https://github.com/viniciusferreira7/url-shortener-api/commit/b41d8f853b5a3861a7e9655aba4c5392199d8080))

# [1.11.0](https://github.com/viniciusferreira7/url-shortener-api/compare/v1.10.0...v1.11.0) (2025-11-16)


### Bug Fixes

* correct in memory urls repository ([d20fd04](https://github.com/viniciusferreira7/url-shortener-api/commit/d20fd04e1878c80eec84d1ea2a5b0a0835283929))


### Features

* add custom config for openapi ([401b6e3](https://github.com/viniciusferreira7/url-shortener-api/commit/401b6e305e1dc9be4a063571e98983d87140403d))
* add watched list to urls liked ([456f794](https://github.com/viniciusferreira7/url-shortener-api/commit/456f794fec171db1c266468d4e3d743995cd16bb))
* apply new params on urls repository methods ([9825bff](https://github.com/viniciusferreira7/url-shortener-api/commit/9825bff3ec538b3f3ea7288179fbe11a71448d6e))
* create use case to delete url ([179f881](https://github.com/viniciusferreira7/url-shortener-api/commit/179f881e874c2c22cdb631f6d58d976446d47910))
* create use case to fetch author urls ([ac9c208](https://github.com/viniciusferreira7/url-shortener-api/commit/ac9c2088301f42b58443c6988c49b6294ce291ec))

# [1.11.0](https://github.com/viniciusferreira7/url-shortener-api/compare/v1.10.0...v1.11.0) (2025-11-16)


### Features

* add custom config for openapi ([401b6e3](https://github.com/viniciusferreira7/url-shortener-api/commit/401b6e305e1dc9be4a063571e98983d87140403d))
* apply new params on urls repository methods ([9825bff](https://github.com/viniciusferreira7/url-shortener-api/commit/9825bff3ec538b3f3ea7288179fbe11a71448d6e))
* create use case to fetch author urls ([ac9c208](https://github.com/viniciusferreira7/url-shortener-api/commit/ac9c2088301f42b58443c6988c49b6294ce291ec))

# [1.11.0](https://github.com/viniciusferreira7/url-shortener-api/compare/v1.10.0...v1.11.0) (2025-11-09)


### Features

* apply new params on urls repository methods ([9825bff](https://github.com/viniciusferreira7/url-shortener-api/commit/9825bff3ec538b3f3ea7288179fbe11a71448d6e))
* create use case to fetch author urls ([ac9c208](https://github.com/viniciusferreira7/url-shortener-api/commit/ac9c2088301f42b58443c6988c49b6294ce291ec))

# [1.11.0](https://github.com/viniciusferreira7/url-shortener-api/compare/v1.10.0...v1.11.0) (2025-11-09)


### Features

* apply new params on urls repository methods ([9825bff](https://github.com/viniciusferreira7/url-shortener-api/commit/9825bff3ec538b3f3ea7288179fbe11a71448d6e))
* create use case to fetch author urls ([ac9c208](https://github.com/viniciusferreira7/url-shortener-api/commit/ac9c2088301f42b58443c6988c49b6294ce291ec))

# [1.10.0](https://github.com/viniciusferreira7/url-shortener-api/compare/v1.9.0...v1.10.0) (2025-11-02)


### Features

* create in memory repositories ([e8c2705](https://github.com/viniciusferreira7/url-shortener-api/commit/e8c27053102cadd5c39b4b77e4b7baa9b260e673))

# [1.9.0](https://github.com/viniciusferreira7/url-shortener-api/compare/v1.8.0...v1.9.0) (2025-11-02)


### Features

* create use case error ([0388e66](https://github.com/viniciusferreira7/url-shortener-api/commit/0388e66cd1379ff9828e48399e4c6609505c084f))
* create use case to create url ([361d795](https://github.com/viniciusferreira7/url-shortener-api/commit/361d795465840fcf49e0a5ac00dec93cb15163f5))

# [1.8.0](https://github.com/viniciusferreira7/url-shortener-api/compare/v1.7.0...v1.8.0) (2025-11-02)


### Features

* create either response ([b53adde](https://github.com/viniciusferreira7/url-shortener-api/commit/b53addee34d4fa53df1aa5fbcf980d012b8290ce))

# [1.7.0](https://github.com/viniciusferreira7/url-shortener-api/compare/v1.6.0...v1.7.0) (2025-11-02)


### Features

* create getters to value objects ([8d379b5](https://github.com/viniciusferreira7/url-shortener-api/commit/8d379b5074317c19e09e93cb71ff25705e165ec6))

# [1.6.0](https://github.com/viniciusferreira7/url-shortener-api/compare/v1.5.0...v1.6.0) (2025-11-02)


### Features

* create url code class ([7ba8730](https://github.com/viniciusferreira7/url-shortener-api/commit/7ba873063a9324fe02d599b74307ee128faf9539))

# [1.5.0](https://github.com/viniciusferreira7/url-shortener-api/compare/v1.4.0...v1.5.0) (2025-10-26)


### Features

* create value objects ([a457d30](https://github.com/viniciusferreira7/url-shortener-api/commit/a457d30fc4691334d24f93d6ba9945d1e010aa8d))

# [1.4.0](https://github.com/viniciusferreira7/url-shortener-api/compare/v1.3.0...v1.4.0) (2025-10-26)


### Features

* create value object core class ([9452435](https://github.com/viniciusferreira7/url-shortener-api/commit/9452435eae5f333271763be207c6b6f2da6c5bdd))

# [1.3.0](https://github.com/viniciusferreira7/url-shortener-api/compare/v1.2.0...v1.3.0) (2025-10-26)


### Features

* create interface to repositories ([5a9266d](https://github.com/viniciusferreira7/url-shortener-api/commit/5a9266dcfe47df2433227747aea8cd701f517ce8))

# [1.2.0](https://github.com/viniciusferreira7/url-shortener-api/compare/v1.1.0...v1.2.0) (2025-10-19)


### Features

* create aggregate rot abstract class ([0626b50](https://github.com/viniciusferreira7/url-shortener-api/commit/0626b503e28499191c0e7da9d9dd8a4f71096d04))
* create core entity ([62a712b](https://github.com/viniciusferreira7/url-shortener-api/commit/62a712b3626a0e543427b321ce4e96625bae263f))
* create url enitity ([4213411](https://github.com/viniciusferreira7/url-shortener-api/commit/4213411d4a46881a543def709388ec78685086d6))
* create user entity ([380ba7b](https://github.com/viniciusferreira7/url-shortener-api/commit/380ba7b7c2a3d3a1a75edfc3e5280634d59ab9c0))
* create value object  unique entity id ([c2700ff](https://github.com/viniciusferreira7/url-shortener-api/commit/c2700ffe69bca45079725d20d8b870856d88da06))
* disable genreation of id by database ([a94851f](https://github.com/viniciusferreira7/url-shortener-api/commit/a94851fdaac6f56e8727b43a7cd0f9797f96f94b))

# [1.1.0](https://github.com/viniciusferreira7/url-shortener-api/compare/v1.0.0...v1.1.0) (2025-10-12)


### Features

* add generation of ids using UUIDv7 ([38a3108](https://github.com/viniciusferreira7/url-shortener-api/commit/38a3108824495e823b88f79c5ae53306f9184e68))
* add tables to using on authentication ([e71feab](https://github.com/viniciusferreira7/url-shortener-api/commit/e71feab89cb1b088379e298829af952bf5038018))

# 1.0.0 (2025-10-05)


### Features

* add drizzle config ([c0eb320](https://github.com/viniciusferreira7/url-shortener-api/commit/c0eb320fc2b7ea191dd59e4928efd3e784969664))
