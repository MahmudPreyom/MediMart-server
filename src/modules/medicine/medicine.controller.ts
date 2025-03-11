import { Request, Response } from 'express';
import { biCycleProductService } from './medicine.service';

const createBiCycle = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const result = await biCycleProductService.createBiCycleProduct(data);
    res.json({
      message: 'Bicycle created successfully',
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Something Went to wrong',
      error: error,
    });
  }
};

const getBiCycle = async (req: Request, res: Response) => {
  try {
    const { searchTerm, sortBy, sortOrder} = req.query;
    const result = await biCycleProductService.getBiCycle(searchTerm as string,
      sortBy as string,
      sortOrder as string);
    // console.log(searchTerm);

    res.send({
      message: 'Bicycles retrieved successfully',
      status: true,
      data: result,
    });
  } catch (error) {
    res.json({
      status: false,
      message: 'Something went wrong',
      error,
    });
  }
};

const getSingleBiCycle = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const result = await biCycleProductService.getSingleBiCycle(id);
    res.send({
      message: 'Bicycle retrieved successfully',
      status: true,
      data: result,
    });
  } catch (error) {
    res.json({
      status: false,
      message: 'Something went to wrong',
      error,
    });
  }
};

const updateBiCycle = async (req: Request, res: Response) => {
  try {
    const biCycleId = req.params.productId;
    const body = req.body;
    const result = await biCycleProductService.updateBiCycle(biCycleId, body);
    res.send({
      message: 'Bicycle updated successfully',
      status: true,
      data: result,
    });
  } catch (error) {
    res.json({
      status: false,
      message: 'Something went to wrong',
      error,
    });
  }
};

const deleteBiCycle = async (req: Request, res: Response) => {
  try {
    const biCycleId = req.params.productId;
    await biCycleProductService.deleteBiCycle(biCycleId);

    res.send({
      message: 'Bicycle deleted successfully',
      status: true,
      data: {},
    });
  } catch (error) {
    res.json({
      status: false,
      message: 'Something went wrong',
      error,
    });
  }
};

export const cycleController = {
  createBiCycle,
  getBiCycle,
  getSingleBiCycle,
  updateBiCycle,
  deleteBiCycle,
};
