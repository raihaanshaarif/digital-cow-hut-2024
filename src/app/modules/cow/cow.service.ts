import { ICow } from './cow.interface';
import { Cow } from './cow.model';

const createCow = async (cowData: ICow): Promise<ICow> => {
  const result = await Cow.create(cowData);
  return result;
};

export const CowService = {
  createCow,
};
