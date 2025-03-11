// import QueryBuilder from '../../app/builder/QueryBuilder';
// import { BicycleSearchableFields } from './bicycle-product.const';
import { TBiCycle } from './medicine.interface';
import BiCycle from './medicine.model';

const createBiCycleProduct = async (data: TBiCycle): Promise<TBiCycle> => {
  const result = await BiCycle.create(data);
  return result;
};

// const getBiCycle = async (searchTerm: string | undefined) => {
//   let query = {};

//   if (searchTerm) {
//     const regex = new RegExp(searchTerm, 'i');
//     query = {
//       $or: [{ name: regex }, { brand: regex }, { type: regex }],
//     };
//   }
//   const result = await BiCycle.find(query);
//   return result;
// };
// testing================================================================================================================
const getBiCycle = async (
  searchTerm: string | undefined,
  sortBy: string | undefined,
  sortOrder: string | undefined,
) => {
  let query = {};

  if (searchTerm) {
    const regex = new RegExp(searchTerm, 'i');
    query = {
      $or: [{ name: regex }, { brand: regex }, { type: regex }],
    };
  }

  // Define sorting criteria (default: sort by price in ascending order)
  const sortCriteria: Record<string, 1 | -1> = {};
  if (sortBy === 'price' || sortBy === 'quantity') {
    sortCriteria[sortBy] = sortOrder === 'desc' ? -1 : 1;
  }

  const result = await BiCycle.find(query).sort(sortCriteria);
  return result;
};
// =============================================================================================================================

const getSingleBiCycle = async (id: string) => {
  const result = await BiCycle.findById(id);
  return result;
};

const updateBiCycle = async (id: string, data: TBiCycle) => {
  const result = await BiCycle.findByIdAndUpdate(id, data, {
    new: true,
  });
  return result;
};

const deleteBiCycle = async (id: string) => {
  const result = await BiCycle.findByIdAndDelete(id);
  return result;
};

export const biCycleProductService = {
  createBiCycleProduct,
  getBiCycle,
  getSingleBiCycle,
  updateBiCycle,
  deleteBiCycle,
};
