
 ## **v2.0.0** [UNRELEASED]

**ADDED**   debug mode. If metamorphosis is registered in debug mode, all logs are displayed in console

**FIXED** todo

**BREAKING CHANGE** now import metamorphosisModule as following:
```
import { MetamorphosisNestModule } from '@fabio.formosa/metamorphosis-nest';

@Module({
  imports: [MetamorphosisModule.register()],
  ...
}
export class MyApp{
}
```

---

