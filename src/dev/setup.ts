import { DefaultDataOptionKey } from 'ptnl-constructor-sdk/constants';
import { setupDevEnv } from 'ptnl-constructor-sdk/dev';
import { EDataset, ECitiesColumn } from 'ptnl-constructor-sdk/dev.assets';
import { EBlockKey } from "../enum";

import { config } from '../config';

setupDevEnv(config, {
    [DefaultDataOptionKey]: {
        dataset: EDataset.Cities,
        blocks: {
            [EBlockKey.X]: [
                // ECitiesColumn.City,
                ECitiesColumn.Population2020,
            ],
            [EBlockKey.Y]: [
                ECitiesColumn.Population1989,
            ],
        },
    },
});

